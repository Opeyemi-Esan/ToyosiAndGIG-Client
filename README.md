# Toyosi & GIG: client app

React + Vite (JavaScript), Tailwind CSS v4, axios, React Router, TanStack Query, Zustand.

## Run

```bash
npm install
cp .env.example .env.local   # then set VITE_API_BASE_URL to your .NET API
npm run dev                  # development
npm run build                # production build into dist/
```

## Things to edit before going live

| What | Where |
| --- | --- |
| Email, phone, WhatsApp, social links | `src/shared/constants/site.js` |
| Services text | `src/shared/constants/services.js` |
| Owanbe / other videos (YouTube ids) | `src/features/videos/data.js` |
| Mission & Vision wording | `src/features/home/components/MissionVisionSection.jsx` |
| About page wording | `src/features/about/pages/AboutPage.jsx` |
| Gallery photos | drop images in `src/assets/images/gallery/` |
| Backend paths | `src/services/endpoints.js` |
| API origin in the CSP header | `public/_headers` (replace `https://api.example.com`) |

The gallery photos and hero video were made from the GIF you shared: replace them with proper photos/footage.

## Home page

`src/features/home/pages/HomePage.jsx` only imports the sections in order:
Hero, Latest Song, Owanbe, Mission & Vision, Services, Featured Songs, Testimony.
Reorder or remove them there.

## Loader

Every API call (axios) is counted in `src/services/busyStore.js`. While any call takes longer than 250ms,
`BusyOverlay` shows the GG logo with a rolling ring. Pass `{ silent: true }` in a request to skip it.

## Payment flow

1. `/book`: booking is created (`POST /api/bookings`), then the payment is initialised on the backend.
2. The browser is redirected to Paystack's hosted checkout. Only `checkout.paystack.com` is allowed.
3. Set the backend's Paystack **callback URL** to `https://YOUR-SITE/payment/success`.
4. `/payment/success` asks the backend to verify the reference. Only a verified payment reaches `/booking/success`.

The amount is never sent from the browser; the backend decides it.

## Security notes

- No secrets in the bundle (`VITE_` values are public). The Paystack secret key stays on the backend.
- Login session is kept in memory only. For sessions that survive a reload, use an httpOnly refresh cookie on the backend and set `VITE_API_WITH_CREDENTIALS=true`.
- Strict CSP and security headers are in `public/_headers` (Cloudflare Pages / Netlify). On other hosts, set the same headers on the server.
- All API links/media must be `https`; React escapes all text, and `dangerouslySetInnerHTML` is never used.
- Client-side validation is for convenience only: the backend must validate and authorise everything.
