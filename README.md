# gaiia Pulse — ISP Operator Dashboard

A real-time operational dashboard for ISP operators, powered by the gaiia BSS/OSS REST API. This proof-of-concept demonstrates that gaiia's open API makes it trivial to build custom reporting and executive dashboards outside of gaiia's built-in Analytics tab — giving operators a Bloomberg Terminal-style command center for their broadband business.

## Setup

```bash
git clone <repo-url> && cd gaiia-pulse
npm install
cp .env.local.example .env.local
# Edit .env.local with your gaiia instance URL and API token
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mock Mode

To run without a live gaiia instance, set `USE_MOCK_DATA=true` in `.env.local` (this is the default). The dashboard will render with realistic mock data for a ~2,500-subscriber ISP.

## Dashboard Sections

- **KPI Strip** — Total subscribers, MRR, open tickets, pending orders, overdue invoices, monthly churn
- **Revenue Chart** — 12-month revenue trend (area chart)
- **Invoice Breakdown** — Paid/unpaid/overdue/void split (donut chart with dollar amounts)
- **Account Health** — Status distribution bar chart + flagged account issues (no payment method, suspended, long-overdue)
- **Support Tickets** — Status breakdown + 5 most recent open tickets with priority and age
- **Order Pipeline** — Order status breakdown + type split (new install/upgrade/disconnect) + recent orders
- **Network Inventory** — Total provisioned devices by type (ONT, router, switch, AP)

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GAIIA_API_URL` | gaiia API base URL (e.g., `https://demo.gaiia.com/api/v1`) | — |
| `GAIIA_API_TOKEN` | Bearer token for API auth | — |
| `USE_MOCK_DATA` | Set `true` to use mock data | `true` |
| `NEXT_PUBLIC_GAIIA_INSTANCE` | Display label for connected instance | `demo.gaiia.com` |
| `NEXT_PUBLIC_REFRESH_INTERVAL_MS` | Auto-refresh interval in ms | `300000` (5 min) |

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Recharts for data visualization
- Server-side API routes proxy all requests (API token never reaches the browser)
- Dark mode by default with light mode toggle

## Note

This is a proof-of-concept. The gaiia API endpoints and response shapes may vary between instance versions — the data layer (`lib/gaiia-client.ts`) is built to degrade gracefully and fall back to mock data if any endpoint returns an error.
