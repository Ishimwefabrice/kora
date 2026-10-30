import { sealLine } from "./gate";
import type { Kit, LedgerLine } from "./types";

const SEED_ID = "kimironko-mama-uwase";

function line(partial: Omit<LedgerLine, "status" | "reason" | "tavilyNote"> & { tavilyNote?: string | null }): LedgerLine {
  return sealLine({ ...partial, tavilyNote: partial.tavilyNote ?? null });
}

export function kimironkoSeed(): Kit {
  const lines: LedgerLine[] = [
    line({
      id: "l1",
      raw: "inyanya 3kg  4 500",
      item: "Tomatoes",
      itemRw: "Inyanya",
      quantity: "3 kg",
      amountRwf: 4500,
      confidence: 0.93
    }),
    line({
      id: "l2",
      raw: "amavuta 1L   ???",
      item: "Cooking oil",
      itemRw: "Amavuta yo guteka",
      quantity: "1 L",
      amountRwf: null,
      confidence: 0.41,
      tavilyNote: "Kimironko cooking-oil pages vary 3,800–5,200 RWF/L. Not written on this page, so the cell stays blank."
    }),
    line({
      id: "l3",
      raw: "itunguru 2kg  2 000",
      item: "Onions",
      itemRw: "Itunguru",
      quantity: "2 kg",
      amountRwf: 2000,
      confidence: 0.9
    }),
    line({
      id: "l4",
      raw: "isabune    800",
      item: "Bar soap",
      itemRw: "Isabune",
      quantity: "1",
      amountRwf: 800,
      confidence: 0.88
    }),
    line({
      id: "l5",
      raw: "ubahe  Ukwakira  35 000",
      item: "October rent",
      itemRw: "Ubukode bwa Ukwakira",
      quantity: "1 month",
      amountRwf: 35000,
      confidence: 0.91
    })
  ];

  return {
    id: SEED_ID,
    userId: null,
    publicSeed: true,
    createdAt: "2026-10-30T07:00:00.000Z",
    shopName: "Mama Uwase stall",
    shopNameRw: "Iduka rya Mama Uwase",
    place: "Kimironko Market, Kigali",
    source: "seed",
    notes: "Public seeded notebook. Not a customer. Kora never messages this stall.",
    lines,
    whatsappRw: [
      "Iduka rya Mama Uwase — Kimironko",
      "Igitabo cyasomwe. Amafaranga adasobanutse ntasigayeho.",
      "",
      "• Inyanya, 3 kg — 4,500 RWF",
      "• Amavuta yo guteka, 1 L — (ntasobanutse ku rupapuro)",
      "• Itunguru, 2 kg — 2,000 RWF",
      "• Isabune — 800 RWF",
      "• Ubukode bwa Ukwakira — 35,000 RWF",
      "",
      "Byemewe: 42,300 RWF",
      "Bidasobanutse: 1 umurongo. Niba ushaka, andika umubare noneho.",
      "",
      "Kora ntiyohereje amafaranga. Tegereza YEWE."
    ].join("\n"),
    whatsappEn: [
      "Mama Uwase stall — Kimironko",
      "Notebook read. Unclear amounts were left blank.",
      "",
      "• Tomatoes, 3 kg — 4,500 RWF",
      "• Cooking oil, 1 L — (not proven on the page)",
      "• Onions, 2 kg — 2,000 RWF",
      "• Bar soap — 800 RWF",
      "• October rent — 35,000 RWF",
      "",
      "Proven total: 42,300 RWF",
      "Blank: 1 line. Write the number if you know it.",
      "",
      "Kora sent no money. Waiting for YES."
    ].join("\n"),
    observatory: [
      {
        agent: "scout",
        model: "nvidia/Nemotron-3.5-Super-VL",
        endpoint: "https://api.tokenfactory.nebius.com/v1/",
        promptTokens: 1840,
        completionTokens: 420,
        ms: 2400
      },
      {
        agent: "ledge",
        model: "code-gate (deterministic)",
        endpoint: "local",
        promptTokens: 0,
        completionTokens: 0,
        ms: 4
      },
      {
        agent: "market",
        model: "tavily/search",
        endpoint: "https://api.tavily.com/search",
        promptTokens: 0,
        completionTokens: 0,
        ms: 680
      },
      {
        agent: "stella",
        model: "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B",
        endpoint: "https://api.tokenfactory.nebius.com/v1/",
        promptTokens: 620,
        completionTokens: 280,
        ms: 910
      }
    ],
    approved: false,
    approvedAt: null,
    paypal: null
  };
}
