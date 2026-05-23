# Supabase Kurulum — tayinciyim.com

## 1. Supabase projesi

1. [Supabase Dashboard](https://supabase.com/dashboard) → New project
2. Proje URL ve anon key'i not edin
3. Settings → API → `service_role` key'i kopyalayın (**yalnızca sunucu tarafı**)

## 2. Ortam değişkenleri

Proje kökünde `.env.local` oluşturun (`.env.example` dosyasından kopyalayın):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=sizin@email.com
```

> `SUPABASE_SERVICE_ROLE_KEY` istemci bundle'ına **asla** eklenmemelidir.

## 3. Veritabanı şeması

SQL Editor → New query → `supabase/schema.sql` içeriğini yapıştırıp **Run**.

## 4. Storage

SQL Editor → `supabase/storage.sql` çalıştırın.

Dashboard → Storage → `listing-images` ve `avatars` bucket'larının **public** olduğunu doğrulayın.

## 5. Seed (isteğe bağlı)

`supabase/seed.sql` çalıştırıldığında **örnek ilanlar** eklenir (çoğu `approved`, bir tanesi `pending`):

| Kategori | Örnek başlık (kısa) |
|----------|---------------------|
| ev-devri | Ankara Çankaya 2+1 ev devri — seed |
| nakliye-ariyorum | Ankara → İzmir 2+1 eşya — seed |
| esya-devri | Seed eşya ilanı (`pending`) |
| nakliyeci-arac-ilani | Ankara → İzmir panelvan — seed |
| sehir-sorusu | Ankara mahalle önerisi — seed |

- Seed **Auth kullanıcısı oluşturmaz** — ilanlarda `user_id` çoğunlukla `null` (misafir).
- Seed içindeki yorum satırlarındaki `profiles` UUID’leri **örnek**tir; canlıda kullanmayın.

### Admin kullanıcı (ayrı adım)

1. Supabase Dashboard → **Authentication** → kullanıcı oluştur (veya `/kayit` ile kayıt).
2. Vercel / `.env.local` → `ADMIN_EMAILS=bu-kullanicinin@email.com`
3. `/giris?next=/admin` ile giriş — middleware + layout admin kontrolü yapar.

> **Önemli:** Seed `profiles` kaydı ile Auth `auth.users` kaydı **aynı şey değildir**.  
> Production’da yeni kullanıcı kaydında `profiles` satırını otomatik açmak için **Auth trigger** (veya uygulama içi signup hook) önerilir — şu an MVP’de profil çoğunlukla mock resolver ile tamamlanır.

### ADMIN_EMAILS

Admin yetkisi **veritabanı rolü değil**, uygulama env listesidir:

```env
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

E-posta Supabase Auth oturumundaki adresle eşleşmelidir.

## 6. Yerel geliştirme

```bash
npm install
npm run dev
```

- Env **yoksa**: mock veri modu (mevcut MVP davranışı)
- Env **varsa**: Supabase DB + Storage + Auth

## 7. Vercel

Project Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (production domain)
- `ADMIN_EMAILS`

Deploy sonrası: `https://alanadiniz.com/sistem-durumu`

## 8. Production güvenlik notları

- [ ] Admin paneli role-based koruma (`TODO` kod içinde)
- [ ] `listings` insert politikasını authenticated'a daraltma (schema yorumları)
- [ ] Service role yalnız server actions / API routes
- [ ] RLS testleri
- [ ] Storage dosya tipi/boyut doğrulama
- [ ] Şikayet moderasyon kuyruğu
- [ ] Audit log

## Dosya sırası özeti

1. `supabase/schema.sql`
2. `supabase/storage.sql`
3. `supabase/seed.sql` (opsiyonel)
