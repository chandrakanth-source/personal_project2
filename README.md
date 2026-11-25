# Sri Thanu Communications

React/Vite shop management app for inventory, invoicing, sales reports, store settings, and a product catalog.

## Setup

1. Install dependencies:

   `npm install`

2. Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor.

3. Create an email/password user in Supabase Authentication for the shop administrator.

4. Copy `.env.example` to `.env.local` and add the Supabase project URL and public anon/publishable key.

5. Start the app:

   `npm run dev`

## Validation

- `npm test` - billing unit tests
- `npm run lint` - Oxlint diagnostics
- `npm run build` - production build

Never place a Supabase service-role key in this browser application.
