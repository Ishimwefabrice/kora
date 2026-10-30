# Kora

The last meter of a Rwandan stall is not an API. It is a paper notebook.

Kora photographs that page, reads it with **NVIDIA Nemotron** on **Nebius Token Factory**, and hands the owner a bilingual WhatsApp kit plus an optional PayPal sandbox draft. Unclear amounts stay blank. Nothing sends until a person taps YES.

This repo is the editable product for:

- Nebius x NVIDIA Global AI Hackathon (Best Apps and Agents)
- PayPal AI Hackathon (PayPal draft after YES)

See `docs/SUBMISSIONS.md` for the other Devpost entries and what cannot be this website.

## Who it is for

Stall owners and landlords who still run numbers in an igitabo. Judges can use the public Kimironko seed without an account.

## Architecture

```
Browser  →  Next.js 15 (App Router)
                ├─ cookie session (jose, httpOnly)
                ├─ Prisma / SQLite  (data/kora.db)
                ├─ Ledge gate       (lib/gate.ts — amounts)
                ├─ Token Factory    (Nemotron VL + Nano)
                └─ PayPal sandbox   (draft invoice only)
```

Roles: **guest** (seed kit), **owner** (own kits), **admin** (`ADMIN_EMAIL`).

Edit the product here:

| You want to change | File |
| --- | --- |
| Colors | `app/globals.css` (`:root` tokens) |
| Copy / landing | `app/page.tsx` |
| Amount rules | `lib/gate.ts` |
| Vision / models | `lib/nebius.ts` |
| Database tables | `prisma/schema.prisma` |
| Seed notebook | `lib/seed.ts` |

## Run

```bash
npm install
copy .env.example .env
npm run db:push
npm run db:seed
npm test
npm run dev
```

Open http://localhost:3000

Local demo account (development only): `owner@kora.local` / `KoraStall!2026`

- Public seed: `/kit/kimironko-mama-uwase`
- Live photo read: log in, then home → Read my page (`NEBIUS_API_KEY` in `.env`)
- YES: records consent and may create a PayPal **draft**. It does not send money.

```bash
npm run build
npm start
```

## Security

- Passwords hashed with bcrypt.
- Sessions in httpOnly cookies.
- API keys only on the server.
- Login / register / extract rate-limited.
- Image uploads capped and type-checked.
- SQL via Prisma parameterized queries.
- The public seed cannot be deleted.

## Tests

`npm test` covers amount sealing and account validation.

## License

MIT
