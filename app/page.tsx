"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<"seed" | "live" | null>(null);
  const [error, setError] = useState("");

  async function extract(seed?: "kimironko") {
    setError("");
    setBusy(seed ? "seed" : "live");
    try {
      let imageDataUrl: string | undefined;
      if (file) {
        imageDataUrl = await readFile(file);
      }
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed, notes, imageDataUrl })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Extract failed");
      router.push(`/kit/${body.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extract failed");
      setBusy(null);
    }
  }

  return (
    <div className="shell">
      <header className="top">
        <div className="mark">
          Kora<span>.</span>
        </div>
        <div className="eyebrow">Nebius Token Factory · NVIDIA Nemotron</div>
      </header>

      <section className="hero">
        <div>
          <div className="stamp">The last meter has no API</div>
          <h1>The notebook still runs the stall.</h1>
          <p className="lede">
            Photograph the igitabo. Scout reads only what is on the page. Ledge blanks anything it would have to guess.
            Stella writes Kinyarwanda and English. Nothing sends until you tap YES.
          </p>
          <div className="actions">
            <button className="btn" disabled={busy !== null} onClick={() => extract("kimironko")}>
              {busy === "seed" ? "Opening seed…" : "Open the Kimironko seed"}
            </button>
            <button className="btn ghost" disabled={busy !== null} onClick={() => extract()}>
              {busy === "live" ? "Reading…" : "Read my page"}
            </button>
          </div>
          <div className="panel">
            <label htmlFor="page">Notebook photo (optional if you open the seed)</label>
            <input
              id="page"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <label htmlFor="notes">Owner notes — never used as an amount</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. This is October rent for stall 14. Do not invent the oil price."
            />
            {error ? <div className="err">{error}</div> : null}
          </div>
        </div>

        <aside className="notebook" aria-label="Seeded Kimironko notebook">
          <h2>Iduka rya Mama Uwase</h2>
          <p>Kimironko · Ukwakira 2026 · public seed, not a customer</p>
          <div className="ruled">
            <span>Inyanya 3kg</span>
            <span>4 500</span>
          </div>
          <div className="ruled blank">
            <span>Amavuta 1L</span>
            <em>???</em>
          </div>
          <div className="ruled">
            <span>Itunguru 2kg</span>
            <span>2 000</span>
          </div>
          <div className="ruled">
            <span>Isabune</span>
            <span>800</span>
          </div>
          <div className="ruled">
            <span>Ubahe Ukwakira</span>
            <span>35 000</span>
          </div>
        </aside>
      </section>

      <section className="grid-3">
        <article className="card">
          <h3>Scout</h3>
          <p>Nemotron 3.5 Super VL on Token Factory looks at the page. If the oil line is a smudge, the amount is null.</p>
        </article>
        <article className="card">
          <h3>Ledge</h3>
          <p>Python-plain TypeScript owns the seal. Confidence below 0.72, missing amount, or a wild number — the cell is blank. The model cannot write RESOLVED.</p>
        </article>
        <article className="card">
          <h3>Stella</h3>
          <p>Nemotron 3 Nano writes a WhatsApp paste kit in Kinyarwanda and English from the sealed ledger only.</p>
        </article>
      </section>

      <footer className="foot">
        <span>Best Apps and Agents · Nebius x NVIDIA Global AI Hackathon</span>
        <Link href="/kit/kimironko-mama-uwase">Already-finished seed kit →</Link>
      </footer>
    </div>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the photo"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
