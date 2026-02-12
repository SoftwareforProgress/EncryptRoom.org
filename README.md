# EncryptRoom Frontend (Next.js)

Landing page and bundle generator for EncryptRoom.

## Features

- App Router + TypeScript (strict mode)
- Dark landing page with product context and mission copy
- Includes attribution: Software for Progress Foundation
- Form for `chat_name` and `password`
- Relay URL configured from environment (not user input)
- Password show/hide toggle
- Client-side validation:
  - `chat_name`: required, trimmed, max 64 chars
  - `password`: required, max 256 chars
- ZIP download from `POST /api/v1/bundles`
- `Content-Disposition` filename support with fallback to `encryptroom-bundle.zip`
- 429 handling with `Retry-After` countdown and temporary submit lockout
- Accessible status/error regions using `aria-live`
- No local/session storage usage for sensitive form values

## Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Available variables:

- `NEXT_PUBLIC_ENCRYPTROOM_API_URL`
  - Example: `https://api.encryptroom.org`
  - Fallback if missing: `https://api.encryptroom.org`
- `NEXT_PUBLIC_ENCRYPTROOM_RELAY_URL`
  - Example: `tls://relay1.encryptroom.org:443`
  - Fallback if missing or invalid: `tls://relay1.encryptroom.org:443`

## Run Locally

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Contract Used

- Base URL from `NEXT_PUBLIC_ENCRYPTROOM_API_URL`
- Relay URL from `NEXT_PUBLIC_ENCRYPTROOM_RELAY_URL`
- Endpoint: `POST /api/v1/bundles`
- Success: `application/zip` response body
- Optional metadata headers:
  - `X-EncryptRoom-Room-ID`
  - `X-EncryptRoom-Chat`
  - `X-EncryptRoom-Room-Name`
- Error JSON support: `{ "error": "..." }`
- Rate limit support: `429` with `Retry-After`

## Tests

This project uses Node's built-in test runner with a dedicated TypeScript compile step.

```bash
yarn test
```

Included tests:

- Unit test for validation logic
- Integration-style API client test for 429 error handling and relay env usage

## Production Build

```bash
yarn build
yarn start
```
