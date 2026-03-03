# Inventory Sync

Multi-channel inventory sync for small sellers (Etsy, Shopify, eBay).

## Features

- Connect multiple sales channels (Shopify, Etsy)
- Link products across channels by SKU or manually
- One-way or two-way quantity sync
- Dashboard with sync status

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
- Create a new Supabase project
- Run the SQL in `supabase/schema.sql`
- Copy `.env.example` to `.env` and add your Supabase credentials

3. Run development server:
```bash
npm run dev
```

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth + Database)
- Tailwind CSS

## Pricing (MVP)

- Free trial: 14 days
- $19-29/month for 1-2 channels
- $39-49/month for 3+ channels

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q668VS3)
