import { daysAgo } from "./helpers";
import { cityToSlug } from "@/lib/location/city-slug";
import type { CityGuide } from "@/types/location-insights";

function guide(
  city: string,
  partial: Omit<CityGuide, "city" | "slug" | "lastUpdatedAt"> & {
    district?: string;
    lastUpdatedAt?: string;
  },
): CityGuide {
  return {
    city,
    slug: cityToSlug(city),
    lastUpdatedAt: partial.lastUpdatedAt ?? daysAgo(7),
    ...partial,
  };
}

export const MOCK_CITY_GUIDES: CityGuide[] = [
  guide("Siirt", {
    summary:
      "Güneydoğu Anadolu'da kompakt şehir yapısı; kamu kurumları merkeze yakın. Örnek veri: aileler için sakin mahalleler, bekâr memurlar için merkez ve üniversite çevresi tercih edilebilir.",
    familyScore: 72,
    singleOfficerScore: 68,
    transportationScore: 65,
    rentLevelScore: 78,
    safetyScore: 70,
    socialLifeScore: 62,
    averageRentNote: "2+1 için örnek aralık: 8.000 – 14.000 TL (demo)",
    recommendedNeighborhoods: ["Merkez", "Kooperatifler", "Yenişehir"],
    cautionNeighborhoods: ["Uç köşe gece konutları — yerel bilgi alın"],
    publicTransportNote: "Merkez içi yürüme; şehirlerarası minibüs ve otobüs hatları.",
    schoolNote: "İlk ve orta öğretim okulları merkeze dağınık; lise ve üniversite kampüsü şehir dışında olabilir.",
    hospitalNote: "Devlet hastanesi ve özel poliklinikler merkezde.",
    marketNote: "Zincir marketler merkezde; haftalık pazar ilçe çevresinde.",
    socialLifeNote: "Kafe ve park alanları sınırlı; sosyal hayat daha çok aile çevresi.",
    officerTips: [
      "Kış aylarında ısıtma giderini sorun.",
      "Kurum servisi veya ortak araç imkânını iş yerinden teyit edin.",
      "Depozito ve aidat örneklerini yerel emlak gruplarıyla karşılaştırın.",
    ],
  }),
  guide("Van", {
    summary:
      "Göl kenarı ve yüksek rakım; ulaşım ve kış koşulları planlamada önemli. Demo veri: merkez ve Edremit yönü memur yerleşimi için sık sorulur.",
    familyScore: 70,
    singleOfficerScore: 74,
    transportationScore: 68,
    rentLevelScore: 75,
    safetyScore: 72,
    socialLifeScore: 70,
    averageRentNote: "2+1 örnek: 9.000 – 16.000 TL (demo)",
    recommendedNeighborhoods: ["İpekyolu merkez", "Edremit", "Buzhane çevresi"],
    cautionNeighborhoods: ["Kışın ulaşımı zor yokuşlu bölgeler"],
    publicTransportNote: "Şehir içi minibüs; havalimanı ve terminal merkeze bağlı.",
    schoolNote: "Okullar merkez ve yeni yerleşim alanlarında.",
    hospitalNote: "Eğitim ve araştırma hastanesi bölgesi merkez dışında olabilir.",
    marketNote: "Market ve yerel üretici pazarları yaygın.",
    socialLifeNote: "Göl kenarı yürüyüş; kışın kapalı mekânlar.",
    officerTips: [
      "Kış lastiği ve yakıt maliyetini bütçeye ekleyin.",
      "Yüksek rakımda kombi/soba tipini kontrol edin.",
    ],
  }),
  guide("Diyarbakır", {
    summary:
      "Geniş metropol; Sur ve yeni yerleşim alanları farklı profil sunar. Demo: kurum yakını ve ulaşım aksı seçimde belirleyici.",
    familyScore: 74,
    singleOfficerScore: 76,
    transportationScore: 72,
    rentLevelScore: 70,
    safetyScore: 68,
    socialLifeScore: 75,
    averageRentNote: "2+1 örnek: 10.000 – 18.000 TL (demo)",
    recommendedNeighborhoods: ["Kayapınar", "Bağlar yeni yerleşim", "Sur çevresi (tarihi doku)"],
    cautionNeighborhoods: ["Trafik yoğunluğu yüksek ara caddeler"],
    publicTransportNote: "Otobüs ve minibüs ağı geniş; merkez trafiği yoğun.",
    schoolNote: "Özel ve devlet okulları yeni yerleşimde yoğun.",
    hospitalNote: "Şehir hastanesi ve üniversite hastanesi farklı ilçelerde.",
    marketNote: "AVM ve yerel çarşılar merkezde.",
    socialLifeNote: "Kafe, park ve kültür alanları merkezde yoğun.",
    officerTips: [
      "Yaz sıcağı için klima ve izolasyonu sorun.",
      "İlan adresini mahalle düzeyinde doğrulayın.",
    ],
  }),
  guide("Mardin", {
    summary:
      "Tarihi doku ve teraslı yapı; ulaşım eğimli sokaklarda zorlaşabilir. Demo veri: manzara ve merkez yakınlık tercih sebebi.",
    familyScore: 71,
    singleOfficerScore: 69,
    transportationScore: 60,
    rentLevelScore: 76,
    safetyScore: 74,
    socialLifeScore: 68,
    averageRentNote: "2+1 örnek: 8.500 – 15.000 TL (demo)",
    recommendedNeighborhoods: ["Yenişehir", "Artuklu merkez"],
    cautionNeighborhoods: ["Dar sokak ve park sorunu olan eski yapı blokları"],
    publicTransportNote: "Merkez yürüme; araç parkı sınırlı olabilir.",
    schoolNote: "Merkez okulları ve kampüs alanı.",
    hospitalNote: "Devlet hastanesi şehir girişinde olabilir.",
    marketNote: "Yerel pazar ve market merkezde.",
    socialLifeNote: "Tarihi mekânlar; akşam sosyal hayat sakin.",
    officerTips: [
      "Eşyalı evde nem ve ısıtma tipine dikkat.",
      "Nakliye için dar sokak uyarısı alın.",
    ],
  }),
  guide("Ankara", {
    summary:
      "Başkent; kurum yoğunluğu yüksek. Demo: Çankaya, Yenimahalle ve Etimesgut memur yerleşiminde sık tercih edilir.",
    familyScore: 82,
    singleOfficerScore: 85,
    transportationScore: 88,
    rentLevelScore: 45,
    safetyScore: 80,
    socialLifeScore: 84,
    averageRentNote: "2+1 örnek: 18.000 – 32.000 TL (demo, merkez ilçeler)",
    recommendedNeighborhoods: ["Çankaya", "Bahçelievler", "Yenimahalle", "Etimesgut"],
    cautionNeighborhoods: ["Ulaşımı zayıf uzak köşe siteler — servis kontrolü"],
    publicTransportNote: "Metro, otobüs ve banliyö hatları geniş.",
    schoolNote: "Kaliteli devlet ve özel okul seçenekleri çok.",
    hospitalNote: "Eğitim hastaneleri ve şehir hastaneleri yaygın.",
    marketNote: "Her mahallede zincir market.",
    socialLifeNote: "AVM, park, kültür merkezleri bol.",
    officerTips: [
      "Kuruma yakınlık için metro durağı mesafesini ölçün.",
      "Site aidatı ve otopark ücretini sorun.",
    ],
  }),
  guide("Bursa", {
    summary:
      "Sanayi ve tarih; ulaşımı güçlü büyükşehir. Demo: Osmangazi ve Nilüfer aile profiline uygun.",
    familyScore: 84,
    singleOfficerScore: 80,
    transportationScore: 82,
    rentLevelScore: 55,
    safetyScore: 82,
    socialLifeScore: 78,
    averageRentNote: "2+1 örnek: 14.000 – 24.000 TL (demo)",
    recommendedNeighborhoods: ["Nilüfer", "Osmangazi merkez", "Görükle (genç memur)"],
    cautionNeighborhoods: ["Sanayi bölgesine çok yakın gürültülü hatlar"],
    publicTransportNote: "Metro ve otobüs; İstanbul bağlantısı yoğun.",
    schoolNote: "Üniversite çevresi ve merkez okulları.",
    hospitalNote: "Şehir hastanesi ve özel hastaneler.",
    marketNote: "AVM ve yerel market bol.",
    socialLifeNote: "Uludağ ve merkez çarşı; aile parkları.",
    officerTips: [
      "İstanbul tayini için Bursa geçiş konutu araştırın.",
      "Depozito devrinde ev sahibi onayını yazılı alın.",
    ],
  }),
  guide("İzmir", {
    summary:
      "Ege'nin en büyük kenti; Bornova ve Karşıyaka memur yerleşiminde popüler. Demo veri.",
    familyScore: 83,
    singleOfficerScore: 88,
    transportationScore: 85,
    rentLevelScore: 50,
    safetyScore: 78,
    socialLifeScore: 90,
    averageRentNote: "2+1 örnek: 16.000 – 28.000 TL (demo)",
    recommendedNeighborhoods: ["Bornova", "Karşıyaka", "Buca (bütçe)"],
    cautionNeighborhoods: ["Rüzgârlı ve nemli bodrum katlar"],
    publicTransportNote: "Metro, tramvay, vapur ve otobüs.",
    schoolNote: "Üniversite bölgesi ve merkez okulları.",
    hospitalNote: "Eğitim hastaneleri ve bölge hastaneleri.",
    marketNote: "Kemeraltı ve zincir marketler.",
    socialLifeNote: "Kordon, kafe kültürü güçlü.",
    officerTips: [
      "Yaz neminde küf riski için daireyi kontrol edin.",
      "Okula yürüme mesafesi ilanlarda sık vurgulanır.",
    ],
  }),
  guide("Erzurum", {
    summary:
      "Yüksek rakım ve sert kış; ısıtma maliyeti kritik. Demo: Yakutiye ve Palandöken çevresi.",
    familyScore: 76,
    singleOfficerScore: 70,
    transportationScore: 70,
    rentLevelScore: 82,
    safetyScore: 80,
    socialLifeScore: 65,
    averageRentNote: "2+1 örnek: 7.500 – 13.000 TL (demo)",
    recommendedNeighborhoods: ["Yakutiye merkez", "Yenişehir", "Palandöken altı"],
    cautionNeighborhoods: ["Kışın kar yükü yüksek üst yamaçlar"],
    publicTransportNote: "Şehir içi otobüs; havalimanı bağlantısı mevcut.",
    schoolNote: "Üniversite şehir profilini etkiler.",
    hospitalNote: "Ata üniversite hastanesi bölgesi.",
    marketNote: "Merkez marketler; kış stokları önemli.",
    socialLifeNote: "Kış sporları; yaz ayları daha hareketli.",
    officerTips: [
      "Doğalgaz faturası örneklerini önceki kiracıdan isteyin.",
      "Çift cam ve izolasyon şart.",
    ],
  }),
];
