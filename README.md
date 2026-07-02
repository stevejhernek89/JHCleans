# JHCleans.com

Production-ready website for **JHCleans.com** — a local residential garbage-can cleaning business.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, and shadcn/ui-style components.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Before Launch Checklist

Update these files with real business data:

| File | What to update |
|------|----------------|
| `lib/config/business.ts` | Phone, email, hours, social links, analytics IDs |
| `lib/config/service-area.ts` | Serviced ZIP codes, cities, region label |
| `lib/config/pricing.ts` | Final prices and plan features |
| `lib/config/content.ts` | FAQs, testimonials (replace placeholders), about copy |
| `.env.local` | Resend API key, notification email, guardian contact |
| Legal pages (`app/privacy`, `app/terms`, etc.) | Have a lawyer review templates |
| `public/` | Add real photos, favicon, OG image |

> **Important:** Public contact info should be parent/guardian-managed since founders may be minors.

## Project Structure

```
app/                    # Pages and server actions
  page.tsx              # Homepage
  book/                 # Multi-step booking form
  services/             # Service offerings
  pricing/              # Pricing plans + quote form
  about/                # About the founders
  contact/              # Contact form + info
  privacy|terms|...     # Legal template pages
  actions/              # Server actions for forms

components/
  layout/               # Header, footer, logo, mobile bar
  home/                 # Homepage sections
  booking/              # Forms (booking, contact, quote)
  ui/                   # shadcn-style UI primitives

lib/
  config/               # Central business configuration
  validations/          # Zod schemas
  email/                # Resend email delivery
  seo/                  # Metadata helpers
  analytics/            # Event tracking utilities
```

## Configuration

All business settings live in `lib/config/`:

- **business.ts** — Name, contact, hours, social, analytics, booking settings
- **service-area.ts** — ZIP code checker data
- **pricing.ts** — Plans and service offerings
- **content.ts** — Features, FAQs, testimonials, about content, navigation

## Forms & Email

Booking, contact, and quote forms use:

- React Hook Form + Zod validation
- Server actions (`app/actions/`)
- Resend for email delivery (when `RESEND_API_KEY` is set)

Without email configured, submissions log to the server console and still return success to the user.

### Supabase (future)

`lib/email/send.ts` includes a stub for storing submissions in Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are configured.

## Environment Variables

See `.env.example` for all variables. Required for email:

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=bookings@jhcleans.com
BOOKING_NOTIFICATION_EMAIL=your@email.com
GUARDIAN_EMAIL=guardian@email.com
```

Analytics (optional — disabled when empty):

```
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables from `.env.example`
4. Set the production domain to `jhcleans.com`
5. Deploy

```bash
npm run build   # Verify locally first
```

Vercel auto-detects Next.js. No extra config needed.

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Replacing Placeholders

### Logo
Replace the text logo in `components/layout/logo.tsx` with an SVG component.

### Photos
- Hero visual: currently CSS/animation-based; swap for a real photo in `components/home/hero-visual.tsx`
- Before/after: replace placeholders in `components/home/before-after-slider.tsx`
- Team photo: add to `app/about/page.tsx` and `components/home/testimonials-section.tsx`

### Testimonials
Set `testimonialsConfig.isPlaceholder` to `false` and replace items in `lib/config/content.ts` with real reviews.

### Statistics
Set `businessConfig.stats.enabled = true` and fill in verified values.

## License

Private — JHCleans.com
