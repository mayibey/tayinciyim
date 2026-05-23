# tayinciyim.net

Kamu tayini ve yer değiştirme sürecinde **ev devri**, **eşya devri**, **nakliye**, **şehir soruları** ve **hizmet verenler** için ilan platformu (MVP / production beta).

## Ne işe yarar?

- Kategorilere göre ilan listeleme ve detay
- İlan verme (form + görsel yükleme)
- Şehir rehberi ve güvenlik uyarıları
- Admin paneli (onay / red)
- Supabase yokken **mock veri** ile demo; env varken **Supabase** repository

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Veri / Auth | Supabase (opsiyonel) |
| Deploy | Vercel |

## Önemli route'lar

| Rota | Açıklama |
|------|----------|
| `/` | Ana sayfa |
| `/ilanlar` | İlan listesi |
| `/ilanlar/[id]` | İlan detay |
| `/ilan-ver` | Yeni ilan |
| `/sehir-rehberi` | Şehir rehberi |
| `/giris` · `/kayit` | Supabase Auth |
| `/admin` | Admin panel (korumalı) |
| `/sistem-durumu` | Deploy smoke test (secret göstermez) |

## Lokal çalıştırma

```bash
npm install
cp .env.example .env.local   # opsiyonel — yoksa mock mod
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

### Mock mod (`.env.local` yok)

- Mock ilanlar listelenir
- Admin production dışında mock uyarısı; production’da kapalı
- Build ve lint env olmadan çalışır

### Supabase mod

`.env.local` içinde en az:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=sizin@email.com
```

Kurulum: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase mod | Proje URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase mod | Anon key (istemci + RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase mod | **Yalnız sunucu** — upload, admin |
| `NEXT_PUBLIC_SITE_URL` | Önerilir | SEO, sitemap, OG |
| `ADMIN_EMAILS` | Production admin | Virgülle ayrılmış e-postalar |
| `CAPTCHA_SITE_KEY` / `CAPTCHA_SECRET_KEY` | Hayır | Yoksa demo pass |

Şablon: [.env.example](./.env.example)

## Deploy (Vercel)

1. Adımlar: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) — **Hızlı Yayın Sırası** bölümü
2. Deploy sonrası: `/sistem-durumu` kontrolü
3. Admin: `/giris?next=/admin` (e-posta `ADMIN_EMAILS` içinde olmalı)

```bash
npm run lint
npm run build
```

## Güvenlik notları

- `SUPABASE_SERVICE_ROLE_KEY` **asla** `NEXT_PUBLIC_` ile eklenmemeli
- Service role yalnızca `src/lib/supabase/server.ts` ve sunucu modülleri
- Admin: middleware + `requireAdmin()` + `ADMIN_EMAILS`
- Formlar: honeypot, rate limit (in-memory), sanitize
- Production TODO: dağıtık rate limit (Upstash), CAPTCHA sağlayıcı, sıkı CSP

## Geliştirme komutları

```bash
npm run dev      # geliştirme
npm run lint     # ESLint
npm run build    # production build
npm run start    # production sunucu
```

## Dokümantasyon

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — SQL, storage, seed, admin
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) — Vercel beta checklist
