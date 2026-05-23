-- Örnek seed — auth.users kayıtları panelden oluşturulduktan sonra profile id'leri eşleştirin.
-- Demo UUID'ler (gerçek projede auth.users ile aynı olmalı):

-- insert into public.profiles (id, full_name, display_name, user_type, city, trust_score, badges)
-- values
--   ('00000000-0000-4000-8000-000000000001', 'Ayşe Kaya', 'Ayşe K.', 'memur', 'Ankara', 92, '["telefon-dogrulandi"]'::jsonb),
--   ('00000000-0000-4000-8000-000000000002', 'Karadeniz Nakliyat', 'Karadeniz Nakliyat', 'nakliyeci', 'Ankara', 95, '["onayli-nakliyeci"]'::jsonb),
--   ('00000000-0000-4000-8000-000000000003', 'Burak Şahin', 'Burak S.', 'bireysel', 'Ankara', 71, '[]'::jsonb);

-- Örnek ilan (user_id null = misafir ilan)
insert into public.listings (
  category, title, description, contact_name, whatsapp,
  city_from, district_from, city_to, status, details, images
) values
(
  'ev-devri',
  'Ankara Çankaya 2+1 ev devri — seed',
  'Seed örnek ilanı. Admin onayından sonra yayında görünür.',
  'Ayşe K.',
  '05321234567',
  'Ankara',
  'Çankaya',
  null,
  'approved',
  '{"neighborhood":"Kızılay","roomCount":"2+1","rentPrice":18500,"furnished":"evet","hasElevator":true,"hasBalcony":true,"hasParking":true,"familyFriendly":true,"suitableForOfficer":true,"landlordContactAvailable":true,"petAllowed":false}'::jsonb,
  '[]'::jsonb
),
(
  'nakliye-ariyorum',
  'Ankara → İzmir 2+1 eşya — seed',
  'Seed nakliye arayan ilanı.',
  'Burak S.',
  '05335556677',
  'Ankara',
  'Çankaya',
  'İzmir',
  'approved',
  '{"loadType":"2+1","elevatorNeededAtPickup":false,"elevatorNeededAtDelivery":false,"packingNeeded":true,"insuranceRequested":true,"flexibleDate":false,"pickupHasElevator":true,"deliveryHasElevator":false,"wantsSharedTruck":true}'::jsonb,
  '[]'::jsonb
),
(
  'esya-devri',
  'Seed eşya ilanı',
  'Örnek eşya devri ilanı.',
  'Elif D.',
  '05329998877',
  'Samsun',
  null,
  null,
  'pending',
  '{"itemCategory":"mobilya","condition":"kullanilmis","listingIntent":"satilik","negotiable":true,"urgentSale":false,"quantity":1,"warrantyAvailable":false,"deliveryIncluded":false,"pickupOnly":true,"bulkSale":false}'::jsonb,
  '[]'::jsonb
),
(
  'nakliyeci-arac-ilani',
  'Ankara → İzmir panelvan — seed',
  'Seed nakliyeci araç ilanı.',
  'Karadeniz Nakliyat',
  '05321112233',
  'Ankara',
  null,
  'İzmir',
  'approved',
  '{"vehicleType":"panelvan","totalCapacityM3":18,"usedCapacityPercent":65,"availableCapacityPercent":35,"canTakeRoomEquivalent":"1+1","hasLift":true,"hasTransportInsurance":true,"hasPackingService":true,"hasAssemblyService":false,"departureDate":"2026-07-01","priceType":"masraf-paylasimi","verifiedCarrier":true}'::jsonb,
  '[]'::jsonb
),
(
  'sehir-sorusu',
  'Ankara mahalle önerisi — seed',
  'Seed şehir sorusu.',
  'Selin M.',
  '05367778899',
  'Ankara',
  'Çankaya',
  null,
  'approved',
  '{"targetCity":"Ankara","targetDistrict":"Çankaya","questionType":"mahalle","officerGroup":"saglikci","answerStatus":"acik"}'::jsonb,
  '[]'::jsonb
)
on conflict do nothing;

-- reviews / transactions: profile uuid'ler hazır olduğunda ekleyin
