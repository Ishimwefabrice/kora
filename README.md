# Kora

The last meter of a Rwandan stall is not an API. It is a paper notebook.

Kora photographs that page, reads it with **NVIDIA Nemotron 3.5 Super VL** on **Nebius Token Factory**, and hands the owner a bilingual WhatsApp kit. Unclear amounts stay blank. Nothing sends until a person taps YES.

Built for the [Nebius x NVIDIA Global AI Hackathon](https://nebiusglobalaihackathon.devpost.com) · **Best Apps and Agents**.

## Why this exists

Kimironko still runs on an igitabo. So do rent books. Chatbots that invent a tomato price are a liability. The winning pattern from serious agent work is the same one plants and archives already learned: the model proposes, **code seals**, a human is the last meter.

Kora is that pattern for a stall.

## What it does

1. **Scout** (`nvidia/Nemotron-3.5-Super-VL` on Token Factory) reads the photo. If the oil line is `???`, `amountRwf` is null.
2. **Ledge** is not a model. TypeScript refuses amounts below 0.72 confidence, missing figures, or numbers over 5,000,000 RWF. Gemini-style “I think it’s 4,000” cannot write the cell.
3. **Market** (optional Tavily) may look up public Kigali price pages for a blank line. It writes a note. It still does not fill the amount.
4. **Stella** (`nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B`) writes Kinyarwanda and English paste text from the **sealed** ledger only.
5. **YES** records consent. Kora still does not send money or autopost.

Judges can open the already-finished public seed without a Token Factory key:

`/kit/kimironko-mama-uwase`

Mama Uwase’s stall is a seeded notebook, not a customer. Kora never messages her.

## Stack

| Piece | Job |
| --- | --- |
| Nebius Token Factory `https://api.tokenfactory.nebius.com/v1/` | OpenAI-compatible inference |
| `nvidia/Nemotron-3.5-Super-VL` | Scout: document / notebook vision |
| `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B` | Stella: bilingual kit, cheap and fast |
| Deterministic gate in `lib/gate.ts` | Ledge: the only writer of proven amounts |
| Tavily Search (optional) | Public-page grounding for blank lines |
| Next.js 15 | App, observatory, seed kit |

## Run

```bash
npm install
copy .env.example .env.local
# put NEBIUS_API_KEY in .env.local for live photos
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Open the Kimironko seed** works with no key. Use this for the demo video if credits are tight.
- **Read my page** needs `NEBIUS_API_KEY` from Token Factory. Hackathon credits: activation code `NEBIUS-DEVPOST-GLOBAL26`.

Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health) reports whether Token Factory and Tavily keys are present. It never prints them.

```bash
npm run build
npm start
```

## Observatory

Every kit shows model id, Token Factory endpoint, token counts, and latency. Seeded numbers are labelled `Seeded kit`. Live runs are labelled `Live Token Factory`.

## Token Factory notes (feedback)

- OpenAI-compatible `chat.completions` with `response_format: json_object` is the whole integration. Switching Scout from VL to another Nemotron is a model id change.
- Super VL is the product. A notebook is an image. Nano is the paste writer so VL spend stays on the page, not on copy.
- Live extraction is fail-closed: no key, no live call. The seed still loads. That is deliberate so a blog link cannot burn credits.

## License

MIT
