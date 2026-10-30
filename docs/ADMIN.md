# Administrator guide

## Environment

Copy `.env.example` to `.env`. Set:

- `DATABASE_URL` — SQLite file relative to `prisma/schema.prisma`
- `SESSION_SECRET` — 32+ random characters in production
- `ADMIN_EMAIL` — that email becomes `admin` on register
- `NEBIUS_API_KEY` — live vision
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` — sandbox drafts only

Never put keys in the client or in git.

## Database

```bash
npm run db:push
npm run db:seed
```

SQLite file: `data/kora.db`. You can inspect it with any SQLite browser.

## Deploy

Host on Node 20+. Use HTTPS. Set `NEXT_PUBLIC_SITE_URL` to the public origin. Run `npm run build` then `npm start`.

## Tests

`npm test` then click through register → dashboard → seed kit → YES as the owner.
