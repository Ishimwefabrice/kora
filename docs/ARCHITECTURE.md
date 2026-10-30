# Architecture

## Users

- Guest: view landing and the public Kimironko seed.
- Owner: register, log in, create kits from photos/notes, edit notes, approve YES, delete own kits.
- Admin: same as owner across all kits when `ADMIN_EMAIL` matches at registration.

## Data

SQLite via Prisma (`prisma/schema.prisma`):

- `User` 1—* `Kit`
- `Kit.lines` and `Kit.observatory` are JSON strings (SQLite has no native JSON column type in older engines; Prisma still stores text).
- `AuditEvent` records extract / approve / update / delete.

## Money rules

`lib/gate.ts` is the only writer of proven amounts. Models may propose. Code seals or blanks.

## Integrations

- Nebius Token Factory: required for live vision. Fail-closed without a key.
- Tavily: optional note on blank lines. Never fills the amount.
- PayPal sandbox: draft invoice after YES. Never send.

## Design tokens

Night navy background, cyan primary, violet secondary, mint success, pink error. Change in `app/globals.css`.
