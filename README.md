# Titan Agency

Marketing site for **Titan Network**, an IT solutions agency — managed IT, networking,
cybersecurity, cloud, and custom software. Includes a Product Suite section showcasing
**TitanDesk** (our in-house service-desk platform, live) alongside upcoming products
**TitanShield** and **TitanCloud**.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Node.js + Express (contact form API)

## Getting started

```bash
npm install
npm run dev:all   # runs the Vite dev server (5190) and the API (4200) together
```

Or run them separately:

```bash
npm run dev      # frontend only
npm run server   # API only
```

## Build

```bash
npm run build
```

## Project structure

- `src/components/` — page sections (Hero, Features, ProductShowcase, Pricing, Faq, Contact, Footer)
- `src/components/mocks/` — hand-built product UI mockups (Dashboard, Support, Network, Reports, Clients, Calendar) used in the Product Suite tour, styled after the real TitanDesk app
- `server/` — Express API backing the contact form (`POST /api/contact`)
