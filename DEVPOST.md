# Devpost submission — Kora

Track: **Best Apps and Agents**

Demo: run `npm run dev` then open http://localhost:3000  
Seed kit (no API key): http://localhost:3000/kit/kimironko-mama-uwase  
Health: http://localhost:3000/api/health

## Short description

Kora photographs a Rwandan shop or rent notebook, reads it with NVIDIA Nemotron on Nebius Token Factory, and returns a Kinyarwanda + English WhatsApp kit. Unclear amounts stay blank. Nothing sends until the owner taps YES.

## What we built

The last meter of a Kigali stall has no API. It has an igitabo. Kora is a four-part fleet:

- Scout — Nemotron 3.5 Super VL on Token Factory reads the page.
- Ledge — deterministic TypeScript. The model cannot declare a price proven.
- Market — optional Tavily lookup for blank lines. Notes only. Never fills the cell.
- Stella — Nemotron 3 Nano writes the paste kit from the sealed ledger.

The public seed is Mama Uwase, Kimironko. Oil is `???` on the page, so the amount is blank even if Tavily finds a market range.

## How NVIDIA Nemotron and Token Factory are used

- Endpoint: `https://api.tokenfactory.nebius.com/v1/chat/completions`
- Vision: `nvidia/Nemotron-3.5-Super-VL`
- Copy: `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B`
- JSON object responses, temperature 0.1
- Observatory prints model, endpoint, tokens, milliseconds on every kit

## Built with

Nebius Token Factory, NVIDIA Nemotron 3.5 Super VL, NVIDIA Nemotron 3 Nano, Tavily, Next.js, TypeScript

## Feedback on Nebius Token Factory and NVIDIA

Token Factory’s OpenAI-compatible API meant the product spine was a model id, not a custom SDK. Super VL is the right Nemotron for a notebook. Nano is the right Nemotron for bilingual paste. Keep them split. A single Ultra call on every WhatsApp rewrite would waste the stall’s $25 credits on copy.

The seed path is a credit-safety choice we borrowed from the real threat model: once a README points at a live roost, hire/extract becomes a way for a stranger to burn Token Factory.

## What to show in the video (under 3 minutes)

1. Landing: “the last meter has no API”
2. Open Kimironko seed
3. Oil line stays blank
4. Observatory names Super VL + Nano + Token Factory
5. Tap YES — still does not send
6. (If key present) upload a handwritten page and show a live Token Factory run
