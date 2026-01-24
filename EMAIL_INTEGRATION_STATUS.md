# Email Integration (Resend + Supabase Edge Functions)

**Date:** January 24, 2026  
**Scope:** Backend only (Supabase Edge Functions in `supabase/functions`)  

## What was added
- Reusable branded email templates (600px max width, navy/teal on white) split per template under `supabase/functions/make-server-ef294769/emails/`.
- Backend-driven sends for required system emails:
  - Email verification (signup) — sent from `/make-server-ef294769/auth/signup`.
  - Account confirmed (once) — POST `/make-server-ef294769/auth/account-confirmed`.
  - Password reset — POST `/make-server-ef294769/auth/password-reset`.
  - Premium purchase confirmed + report ready — sent from Stripe webhook on `checkout.session.completed` (guest + logged-in).
  - Payment failed — sent on `payment_intent.payment_failed` / `checkout.session.async_payment_failed` / `checkout.session.expired`.
  - Support contact confirmation — sent from `/make-server-ef294769/contact`.
- Env-aware absolute URLs (fallbacks: `http://localhost:5173` in dev, `https://www.yieldpulse.ae` in prod).

## New / required environment variables
- `RESEND_API_KEY` — Resend API key (required for all sends).
- `RESEND_FROM_EMAIL` — default FROM address (e.g., `noreply@yieldpulse.ae`); wrapped as `YieldPulse <…>` if name not provided.
- `APP_BASE_URL` (preferred) or `PUBLIC_SITE_URL` / `SITE_URL` / `NEXT_PUBLIC_SITE_URL` — base URL for links.
- Existing: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `SERVICE_ROLE_KEY`), `SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ENVIRONMENT`.

## Manual test checklist (backend)
1) **Verification email**: Call POST `/make-server-ef294769/auth/signup` with email/password/fullName and confirm Resend shows a “Verify Email” send; link should point to `/auth/verify-email` on your base URL.  
2) **Password reset**: POST `/make-server-ef294769/auth/password-reset` with email; check email contains reset link (Supabase recovery link).  
3) **Account confirmed**: After verifying email, call POST `/make-server-ef294769/auth/account-confirmed` with bearer token; ensure a single “Account confirmed” email; repeated calls should return `alreadySent: true`.  
4) **Purchase success**: Complete Stripe checkout; on webhook success expect two emails: “Payment confirmed” and “Report ready” with dashboard link.  
5) **Payment failed**: Trigger a failed payment (e.g., decline card); verify “Payment failed – action required” email.  
6) **Support contact**: Submit `/make-server-ef294769/contact`; confirm acknowledgement email with reference ID.  

## Notes
- Emails send best-effort; webhook continues even if email dispatch fails (logged as warnings).
- All templates avoid images/icons per branding rules; pure text + CTA button.
- URLs are absolute and environment-driven; buttons include fallback plain links in body.
