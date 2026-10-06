> Database is already set up (Supabase project "nam-sora-store" with 5 sample products). Skip step 1 and just fill the 4 CHANGE/PASTE values in `.env.local`.

# Nam Sora Store (Next.js + Supabase)

1. Create a Supabase project, open SQL Editor and run `supabase/schema.sql`.
2. Copy `.env.example` to `.env.local` and fill in the keys (Supabase Settings > API), your WhatsApp number (880...), a strong ADMIN_PASSWORD and a random ADMIN_SECRET.
3. `npm install` then `npm run dev`. Store: `/`, admin: `/admin`.
4. Product photos upload from /admin (stored in the Supabase "products" bucket created by schema.sql).
5. Deploy: push to GitHub, import in Vercel, add the same env vars.

Never expose SUPABASE_SERVICE_ROLE_KEY (do not prefix it with NEXT_PUBLIC_).

Optional: set RESEND_API_KEY and NOTIFY_EMAIL to get an email for every new order (with a free Resend account, sending to your own signup email works without a domain).

bKash/Nagad: customers pay by Send Money to the numbers in NEXT_PUBLIC_BKASH_NUMBER / NEXT_PUBLIC_NAGAD_NUMBER and enter the TrxID. Check the TrxID in your bKash/Nagad app, then mark the order confirmed in /admin. (Automatic verification needs a bKash/Nagad merchant account.)
