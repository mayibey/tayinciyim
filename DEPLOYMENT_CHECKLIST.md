# Production Beta — Deploy Kontrol Listesi

tayinciyim.net MVP’yi Vercel’de beta yayınına almadan önce bu listeyi sırayla tamamlayın.

## Hızlı yayın sırası

1. Supabase project oluştur
2. `supabase/schema.sql` çalıştır
3. `supabase/storage.sql` çalıştır
4. `supabase/seed.sql` isteğe bağlı çalıştır
5. Vercel’de projeyi import et (Git repo bağla)
6. Environment variables ekle (aşağıdaki tablo)
7. `ADMIN_EMAILS` ekle (gerçek admin e-postaları)
8. Deploy al
9. **`/sistem-durumu`** — mod, Supabase erişimi, env özeti kontrol
10. **`/giris`** — admin hesabı oluştur veya giriş yap
11. **`/admin`** — panel ve yayın kontrol listesi
12. Domain bağla (`NEXT_PUBLIC_SITE_URL` güncelle)
13. İlk test ilanını oluştur (`/ilan-ver`)
14. Fotoğraf upload test et (max 10, 5 MB, JPEG/PNG/WebP)
15. `robots.txt` ve `/sitemap.xml` — production’da index açık mı kontrol et

---

## 1. Supabase SQL sırası

SQL Editor’da sırayla çalıştırın:

1. `supabase/schema.sql` — tablolar, RLS, indeksler
2. `supabase/storage.sql` — bucket ve storage politikaları
3. `supabase/seed.sql` (isteğe bağlı) — örnek ilanlar

Kontrol:

- [ ] `listings`, `reports` tabloları oluştu
- [ ] RLS açık ve test edildi
- [ ] Auth kullanıcıları ile `profiles` UUID eşleşmesi (seed kullanıyorsanız)

## 2. Storage bucket

Dashboard → Storage:

- [ ] `listing-images` — public, max dosya boyutu uygun
- [ ] `avatars` — public (profil görselleri için)

Upload testi: ilan ver → en fazla 10 görsel, her biri ≤ 5 MB, JPEG/PNG/WebP.

## 3. Yerel `.env.local`

`.env.example` dosyasından kopyalayın:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=sizin@email.com
```

Opsiyonel:

```env
CAPTCHA_SITE_KEY=
CAPTCHA_SECRET_KEY=
```

- [ ] `npm run dev` — Supabase bağlı modda ilan oluşturma
- [ ] Env **yokken** mock mod hâlâ çalışıyor

## 4. Vercel environment variables

Project → Settings → Environment Variables (Production + Preview):

| Değişken | Zorunlu | Not |
|----------|---------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Evet | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Evet | |
| `SUPABASE_SERVICE_ROLE_KEY` | Evet | Sunucu only |
| `NEXT_PUBLIC_SITE_URL` | Evet | `https://tayinciyim.net` |
| `ADMIN_EMAILS` | Evet | Virgülle ayrılmış admin e-postaları |
| `CAPTCHA_SITE_KEY` | Hayır | Yoksa demo pass |
| `CAPTCHA_SECRET_KEY` | Hayır | |

- [ ] `SUPABASE_SERVICE_ROLE_KEY` **Preview/Production**’da tanımlı, client’a sızmıyor

## 5. Build ve deploy

```bash
npm run lint
npm run build
```

Vercel:

- Framework: Next.js
- Build command: `npm run build`
- Output: varsayılan (App Router)

- [ ] Build log hatasız
- [ ] Preview URL’de smoke test

## 6. Domain

- [ ] Vercel → Domains → `tayinciyim.net` + `www` (isteğe bağlı redirect)
- [ ] `NEXT_PUBLIC_SITE_URL` production domain ile eşleşiyor
- [ ] SSL aktif

## 7. İlk admin

1. `/kayit` veya Supabase Dashboard → Authentication → kullanıcı oluştur
2. E-posta `ADMIN_EMAILS` listesinde olmalı
3. `/giris?next=/admin` → admin panel açılmalı
4. Üst bant: “Admin olarak oturum açıldı: …”

- [ ] Admin olmayan kullanıcı `/admin` → `/admin/yetkisiz`
- [ ] Oturumsuz `/admin` → `/giris?next=/admin`

## 8. İlk seed ilanları

- [ ] `seed.sql` çalıştırıldı veya admin panelden manuel onaylı ilan
- [ ] Ana sayfa ve `/ilanlar` listeleri dolu görünüyor
- [ ] Görsel URL’leri Supabase Storage’dan yükleniyor

## 9. Production test listesi

Güvenlik / spam:

- [ ] İlan ver formu — honeypot dolu → “İşlem güvenlik kontrolünden geçemedi.”
- [ ] Çok hızlı çift gönderim engelleniyor
- [ ] Rate limit (aynı IP, kısa sürede çok ilan) — demo in-memory

İçerik:

- [ ] WhatsApp linkleri doğru
- [ ] OG görsel: `/og-default.svg` erişilebilir
- [ ] `robots.txt` production’da index açık, development’ta noindex

Admin:

- [ ] Admin panelde “Yayın kontrol listesi” kartı yeşil/kırmızı doğru
- [ ] İlan durumu güncelleme (onay / red)

## 10. Rollback planı

1. Vercel → Deployments → önceki başarılı deployment → **Promote to Production**
2. Supabase migration geri alma gerekiyorsa yedekten restore (Dashboard → Backups)
3. Kritik env değişikliği yapıldıysa önceki değerlere dön
4. İletişim: beta kullanıcılarına kısa durum notu

## 11. Beta sonrası (TODO)

- [ ] Upstash/Redis ile dağıtık rate limit (`src/lib/security/rate-limit.ts`)
- [ ] CAPTCHA sağlayıcı entegrasyonu (`src/lib/security/captcha.ts`)
- [ ] CSP sıkılaştırma (nonce) — `src/middleware.ts`
- [ ] Admin için Supabase `app_metadata.role` veya `profiles.is_admin`
- [ ] Audit log (admin işlemleri)

## İlgili dosyalar

- `SUPABASE_SETUP.md` — Supabase kurulum özeti
- `.env.example` — ortam değişkenleri şablonu
- `src/lib/admin/admin-auth.ts` — admin yetki modeli
- `src/middleware.ts` — session refresh + admin route + güvenlik header’ları
