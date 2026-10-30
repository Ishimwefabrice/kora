import type { LedgerLine } from "./types";

export const MIN_CONFIDENCE = 0.72;
export const MAX_LINE_RWF = 5_000_000;

const AMOUNT = /(?:rwf|frw|fRw|RWF)?\s*([0-9]{1,3}(?:[.,\s][0-9]{3})+|[0-9]{2,7})\s*(?:rwf|frw)?/i;

export function parseAmount(raw: string): number | null {
  const match = raw.match(AMOUNT);
  if (!match) return null;
  const n = Number(match[1].replace(/[.,\s]/g, ""));
  if (!Number.isFinite(n) || n <= 0 || n > MAX_LINE_RWF) return null;
  return n;
}

export function sealLine(line: Omit<LedgerLine, "status" | "reason"> & { status?: LedgerLine["status"]; reason?: string }): LedgerLine {
  if (line.amountRwf == null) {
    return {
      ...line,
      amountRwf: null,
      status: "blank",
      reason: "No proven amount. Kora will not invent one."
    };
  }
  if (line.confidence < MIN_CONFIDENCE) {
    return {
      ...line,
      amountRwf: null,
      status: "blank",
      reason: `Confidence ${line.confidence.toFixed(2)} is below ${MIN_CONFIDENCE}. Amount left blank.`
    };
  }
  if (line.amountRwf > MAX_LINE_RWF) {
    return {
      ...line,
      amountRwf: null,
      status: "blank",
      reason: "Amount larger than the safety cap. Held for a person."
    };
  }
  return {
    ...line,
    status: "proven",
    reason: "Amount read from the page and sealed by code."
  };
}

export function provenTotal(lines: LedgerLine[]): number {
  return lines.reduce((sum, line) => sum + (line.status === "proven" && line.amountRwf ? line.amountRwf : 0), 0);
}

export function formatRwf(n: number | null): string {
  if (n == null) return "—";
  return `${n.toLocaleString("en-US")} RWF`;
}
