# Güvenlik Notları — tayinciyim.net (beta)

## K1 — Listings RLS insert

| Policy | Kim | Koşul |
|--------|-----|--------|
| `listings_guest_insert` | `anon` | `user_id IS NULL`, `status = pending`, featured/report_count kilitli |
| `listings_auth_insert` | `authenticated` | `user_id = auth.uid()`, `status = pending` |

- Public **update/delete** yok; admin onay **service role** (`updateListingStatus`).
- Uygulama: `mapListingToInsertPayload` client `userId` / `status` kabul etmez.

## Sprint 2 — profiles RLS ve public_profiles

**Eski risk:** `profiles_public_read` + `using (true)` → `phone`, `email`, `whatsapp` ham okunabiliyordu.

**Yeni model:**

| Kaynak | Kim okur | PII |
|--------|----------|-----|
| `profiles` tablosu | `authenticated` + `auth.uid() = id` | Tam (kendi profili) |
| `public_profiles` view | `anon` / `authenticated` (grant) | Yok |
| `profiles` (service role) | Admin server action + `requireAdmin` | Tam |

- Public UI: `getPublicUserProfileById()` → `public_profiles`.
- Oturum: `getCurrentUserProfile()` → `profiles` (RLS).
- Admin: `getAdminUserProfileById()` → service role + admin oturumu.

View sütunları: `display_name`, `avatar_url`, güven puanı, rozetler vb. — **phone / email / whatsapp / full_name yok**.

## public_listings view

- Schema: `public.public_listings` — onaylı ilanlar, `contact_name` / `whatsapp` yok.
- Uygulama: `getListings()` / `getListingById()` public modda bu view’ı okur.
- Admin: `includeAllStatuses: true` → `listings` tablosu + `getAdminListingView()`.
- Ek savunma: `getPublicListingView()` isim maskeleme (view’da contact yokken).

## K4 — PII maskeleme ve contact reveal

- Liste/detay: view + `getPublicListingView()`.
- **Contact reveal:** `revealListingContactAction(listingId, captchaToken?)`
  - Rate limit: `contact-reveal:{listingId}:{IP}` (10 dk penceresi).
  - Yalnızca `approved` ilan; service role ile tek WhatsApp okuma.
  - Yanıt: **yalnızca `whatsappUrl`** — ham telefon dönmez.
  - `captchaToken` gönderilirse `verifyCaptcha` çalışır; provider yapılandırılmışsa token zorunlu.
  - Production’da CAPTCHA yoksa `warnCaptchaNotConfigured` log.
  - **TODO:** Yüksek risk / abuse’da oturum zorunluluğu.
  - **TODO:** CAPTCHA’yı her reveal’de zorunlu yap (politika).

## K6 — Mock veri

- `hasSupabaseEnv() === true` → yalnızca DB; mock kapalı.
- Env yok → mock mod (geliştirme).

## İlan yazarı ve yorumlar

- `enrichListingsWithAuthors()` — `public_profiles` batch; `listing.authorSnapshot`.
- `getReviewsForUserProfile()` — yazar adı/avatar `public_profiles` batch.
- Profil yoksa: **"Doğrulanmış kullanıcı"**.

## Manuel test notları

| Senaryo | Beklenen |
|---------|----------|
| Public profil API/view | `phone`, `email` yok |
| Kendi profil (oturum) | `profiles` tam okuma |
| İlan kartı | `authorSnapshot` / görünen ad |
| ReviewList | İsim + avatar (Supabase) |
| WhatsApp reveal | Action → URL, ham numara yok |
| Admin panel | Tam contact (`listings` + admin view) |
| Env yok | Mock mod |

## Kalan riskler

- Rate limit bellek içi (Upstash TODO)
- CAPTCHA provider stub — env varken siteverify tam değil
- `listings_approved_read` hâlâ tam satır okuyabilir (RLS); uygulama `public_listings` kullanıyor
- `carrier_profiles` public read `using (true)`
- RLS admin role DB’de yok (service role)

## Supabase deploy

`supabase/schema.sql` dosyasını SQL Editor’de **yeniden çalıştırın** (idempotent `drop policy` / `create or replace view`).
