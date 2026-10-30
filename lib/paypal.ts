import { provenTotal } from "./gate";
import type { Kit } from "./types";

const BASE = process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export type PayPalDraft = {
  mode: "sandbox-live" | "seed";
  status: string;
  invoiceId: string | null;
  href: string | null;
  note: string;
};

async function token(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal keys missing");
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error_description || "PayPal token failed");
  return body.access_token as string;
}

export function paypalReady(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export async function draftInvoice(kit: Kit): Promise<PayPalDraft> {
  const items = kit.lines
    .filter((l) => l.status === "proven" && l.amountRwf)
    .map((l) => ({
      name: `${l.itemRw} / ${l.item}`.slice(0, 120),
      quantity: "1",
      unit_amount: { currency_code: "USD", value: rwfToUsd(l.amountRwf as number) }
    }));

  if (!paypalReady() || items.length === 0) {
    return {
      mode: "seed",
      status: "DRAFT_LOCAL",
      invoiceId: null,
      href: null,
      note: `Proven ${provenTotal(kit.lines)} RWF mapped to a PayPal sandbox draft. Keys absent or no proven lines — nothing was sent.`
    };
  }

  const access = await token();
  const res = await fetch(`${BASE}/v2/invoicing/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `kora-${kit.id}`
    },
    body: JSON.stringify({
      detail: {
        currency_code: "USD",
        invoice_number: `KORA-${kit.id.slice(0, 8).toUpperCase()}`,
        note: "Kora draft. Unproven notebook lines were omitted. This invoice is not sent until a person uses PayPal send.",
        reference: kit.id
      },
      invoicer: { name: { given_name: "Kora", surname: "Stall" } },
      items
    })
  });
  const body = await res.json();
  const href = Array.isArray(body?.href) ? body.href[0]?.href : body?.href ?? null;
  return {
    mode: "sandbox-live",
    status: res.ok ? "DRAFT" : "ERROR",
    invoiceId: body?.id ?? null,
    href,
    note: res.ok
      ? "PayPal sandbox draft created. Kora did not send it."
      : body?.message || "PayPal draft failed. Nothing sent."
  };
}

function rwfToUsd(rwf: number): string {
  const usd = rwf / 1400;
  return Math.max(0.01, Math.round(usd * 100) / 100).toFixed(2);
}
