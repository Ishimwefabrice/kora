import { randomUUID } from "node:crypto";
import { MIN_CONFIDENCE, sealLine } from "./gate";
import { searchMarket } from "./tavily";
import type { ExtractRequest, Kit, LedgerLine, ObservatoryCall } from "./types";

const ENDPOINT = process.env.NEBIUS_BASE_URL || "https://api.tokenfactory.nebius.com/v1/";
const VISION = "nvidia/Nemotron-3.5-Super-VL";
const COPY = "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};

type ChatResult = {
  text: string;
  promptTokens: number;
  completionTokens: number;
  ms: number;
  model: string;
};

function key(): string {
  const k = process.env.NEBIUS_API_KEY;
  if (!k) throw new Error("NEBIUS_API_KEY is missing. Live extraction is closed.");
  return k;
}

async function chat(model: string, messages: ChatMessage[], json = true): Promise<ChatResult> {
  const started = Date.now();
  const res = await fetch(`${ENDPOINT.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: json ? { type: "json_object" } : undefined,
      messages
    })
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error?.message || `Token Factory ${res.status}`);
  }
  return {
    text: body.choices?.[0]?.message?.content ?? "",
    promptTokens: body.usage?.prompt_tokens ?? 0,
    completionTokens: body.usage?.completion_tokens ?? 0,
    ms: Date.now() - started,
    model: body.model || model
  };
}

const SCOUT_SYSTEM = `You are Scout, the vision agent inside Kora.
You read a photograph of a Rwandan shop or rent notebook (igitabo).
Return JSON only:
{
  "shopName": string,
  "shopNameRw": string,
  "place": string,
  "lines": [
    {
      "raw": string,
      "item": string,
      "itemRw": string,
      "quantity": string | null,
      "amountRwf": number | null,
      "confidence": number
    }
  ]
}
Rules:
- confidence is 0..1 for the amount, not the item name.
- If the amount is smudged, missing, or you would have to guess, amountRwf MUST be null and confidence below 0.5.
- Never invent a second stall, a dish, or a price that is not on the page.
- Prefer Kinyarwanda item names the page actually uses.`;

const STELLA_SYSTEM = `You are Stella, Kora's paste writer.
Given a sealed ledger (amounts already decided by code), write two WhatsApp messages: Kinyarwanda and English.
Return JSON: { "whatsappRw": string, "whatsappEn": string }
Rules:
- List every line. Proven lines show the amount. Blank lines say the amount was not proven.
- End with proven total. Say Kora sent no money and is waiting for YES.
- Do not add goods, greetings-as-ads, or prices that are not in the ledger.`;

type ScoutJson = {
  shopName?: string;
  shopNameRw?: string;
  place?: string;
  lines?: Array<{
    raw?: string;
    item?: string;
    itemRw?: string;
    quantity?: string | null;
    amountRwf?: number | null;
    confidence?: number;
  }>;
};

export async function runFleet(input: ExtractRequest): Promise<Kit> {
  const observatory: ObservatoryCall[] = [];
  const userText = [
    "Read this notebook page.",
    input.notes ? `Owner notes (not amounts unless also on the page): ${input.notes}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  const content: ChatMessage["content"] = [{ type: "text", text: userText }];
  if (input.imageDataUrl) {
    content.push({ type: "image_url", image_url: { url: input.imageDataUrl } });
  }

  const scout = await chat(VISION, [
    { role: "system", content: SCOUT_SYSTEM },
    { role: "user", content }
  ]);
  observatory.push({
    agent: "scout",
    model: scout.model,
    endpoint: ENDPOINT,
    promptTokens: scout.promptTokens,
    completionTokens: scout.completionTokens,
    ms: scout.ms
  });

  let parsed: ScoutJson = {};
  try {
    parsed = JSON.parse(scout.text) as ScoutJson;
  } catch {
    parsed = {};
  }

  const sealed: LedgerLine[] = (parsed.lines ?? []).map((row, i) =>
    sealLine({
      id: `l${i + 1}`,
      raw: String(row.raw ?? ""),
      item: String(row.item ?? "Unknown line"),
      itemRw: String(row.itemRw ?? row.item ?? "Umurongo"),
      quantity: row.quantity ? String(row.quantity) : null,
      amountRwf: typeof row.amountRwf === "number" ? row.amountRwf : null,
      confidence: typeof row.confidence === "number" ? row.confidence : 0,
      tavilyNote: null
    })
  );

  observatory.push({
    agent: "ledge",
    model: "code-gate (deterministic)",
    endpoint: "local",
    promptTokens: 0,
    completionTokens: 0,
    ms: 1
  });

  const market = await searchMarket(sealed);
  if (market.called) {
    observatory.push({
      agent: "market",
      model: "tavily/search",
      endpoint: "https://api.tavily.com/search",
      promptTokens: 0,
      completionTokens: 0,
      ms: market.ms
    });
  }

  const stella = await chat(COPY, [
    { role: "system", content: STELLA_SYSTEM },
    {
      role: "user",
      content: JSON.stringify({
        shopName: parsed.shopName,
        shopNameRw: parsed.shopNameRw,
        place: parsed.place,
        minConfidence: MIN_CONFIDENCE,
        lines: market.lines.map((l) => ({
          item: l.item,
          itemRw: l.itemRw,
          quantity: l.quantity,
          amountRwf: l.amountRwf,
          status: l.status
        }))
      })
    }
  ]);
  observatory.push({
    agent: "stella",
    model: stella.model,
    endpoint: ENDPOINT,
    promptTokens: stella.promptTokens,
    completionTokens: stella.completionTokens,
    ms: stella.ms
  });

  let kitCopy = { whatsappRw: "", whatsappEn: "" };
  try {
    kitCopy = JSON.parse(stella.text) as typeof kitCopy;
  } catch {
    kitCopy = fallbackCopy(parsed.shopNameRw || parsed.shopName || "Igitabo", market.lines);
  }

  return {
    id: randomUUID(),
    userId: null,
    publicSeed: false,
    createdAt: new Date().toISOString(),
    shopName: parsed.shopName || "Unnamed stall",
    shopNameRw: parsed.shopNameRw || parsed.shopName || "Iduka",
    place: parsed.place || "Rwanda",
    source: "live",
    notes: input.notes || "",
    lines: market.lines,
    whatsappRw: kitCopy.whatsappRw,
    whatsappEn: kitCopy.whatsappEn,
    observatory,
    approved: false,
    approvedAt: null,
    paypal: null
  };
}

function fallbackCopy(name: string, lines: LedgerLine[]) {
  const proven = lines.filter((l) => l.status === "proven");
  const total = proven.reduce((s, l) => s + (l.amountRwf || 0), 0);
  const listRw = lines
    .map((l) => `• ${l.itemRw}${l.quantity ? `, ${l.quantity}` : ""} — ${l.status === "proven" ? `${l.amountRwf} RWF` : "(ntasobanutse)"}`)
    .join("\n");
  const listEn = lines
    .map((l) => `• ${l.item}${l.quantity ? `, ${l.quantity}` : ""} — ${l.status === "proven" ? `${l.amountRwf} RWF` : "(not proven)"}`)
    .join("\n");
  return {
    whatsappRw: `${name}\n${listRw}\n\nByemewe: ${total} RWF\nKora ntiyohereje amafaranga. Tegereza YEWE.`,
    whatsappEn: `${name}\n${listEn}\n\nProven total: ${total} RWF\nKora sent no money. Waiting for YES.`
  };
}

export function tokenFactoryReady(): boolean {
  return Boolean(process.env.NEBIUS_API_KEY);
}

export const MODELS = { VISION, COPY, ENDPOINT };
