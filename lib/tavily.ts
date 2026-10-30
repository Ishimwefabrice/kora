import type { LedgerLine } from "./types";

type MarketResult = { lines: LedgerLine[]; called: boolean; ms: number };

export async function searchMarket(lines: LedgerLine[]): Promise<MarketResult> {
  const key = process.env.TAVILY_API_KEY;
  const blanks = lines.filter((l) => l.status === "blank");
  if (!key || blanks.length === 0) {
    return { lines, called: false, ms: 0 };
  }

  const started = Date.now();
  const query = `${blanks[0].item} price Kigali Kimironko market Rwanda RWF`;
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        max_results: 3,
        include_answer: true,
        country: "rwanda"
      })
    });
    const body = await res.json();
    const answer = typeof body.answer === "string" ? body.answer : "";
    const snippet = Array.isArray(body.results)
      ? body.results
          .slice(0, 2)
          .map((r: { title?: string; url?: string }) => `${r.title ?? ""} ${r.url ?? ""}`.trim())
          .filter(Boolean)
          .join(" · ")
      : "";
    const note = [answer, snippet].filter(Boolean).join(" ").slice(0, 280);
    const next = lines.map((line) => {
      if (line.id !== blanks[0].id || !note) return line;
      return {
        ...line,
        tavilyNote: `Public pages (not this notebook): ${note} Kora still will not fill the amount.`
      };
    });
    return { lines: next, called: true, ms: Date.now() - started };
  } catch {
    return { lines, called: true, ms: Date.now() - started };
  }
}
