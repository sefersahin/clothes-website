# Backlog

## Customer account verification

Signup currently creates an account immediately with no email or phone verification
(`app/api/auth/signup/route.ts`). Add an email (and/or SMS) verification step before an
account is considered active — e.g. a verification token/code sent on signup, an
"unverified" state on `Customer`, and gating sensitive actions until verified. A password
reset ("Şifremi Unuttum") flow depends on the same verified-contact-info groundwork and
should be built alongside it.

## Promotion codes

The cart page (`app/(site)/sepet/CartPageClient.tsx`) has a promotion code input field, but
it is not wired to any real logic yet — submitting a code just shows a "coming soon"
message. Build out:

- A `PromotionCode` model (code, discount type/amount, active window, usage limits).
- Validation + discount application at checkout (`app/api/orders/route.ts`).
- Specific campaigns the client wants: a welcome code for new members, and seasonal codes
  (Valentine's Day, Mother's Day, etc.) with start/end dates.
- Admin UI to create/manage codes.
