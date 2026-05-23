export type TrRegion =
  | "Marmara"
  | "Ege"
  | "Akdeniz"
  | "İç Anadolu"
  | "Karadeniz"
  | "Doğu Anadolu"
  | "Güneydoğu Anadolu";

export interface TrCity {
  name: string;
  slug: string;
  region: TrRegion;
}

// Slug'lar src/lib/matching/city-proximity.ts'teki normalizeCity çıktısıyla birebir.
// Node default toLowerCase: "İ" (U+0130) → "i" + combining dot (U+0307).
// İstanbul ve İzmir için slug "i̇..." formatında — normalizeCity davranışıyla
// uyum sağlamak için. Bu, mevcut bir özelliktir (normalizeCity'ye dokunulmadı).

export const TR_CITIES: TrCity[] = [
  { name: "Adana", slug: "adana", region: "Akdeniz" },
  { name: "Adıyaman", slug: "adiyaman", region: "Güneydoğu Anadolu" },
  { name: "Afyonkarahisar", slug: "afyonkarahisar", region: "Ege" },
  { name: "Ağrı", slug: "agri", region: "Doğu Anadolu" },
  { name: "Aksaray", slug: "aksaray", region: "İç Anadolu" },
  { name: "Amasya", slug: "amasya", region: "Karadeniz" },
  { name: "Ankara", slug: "ankara", region: "İç Anadolu" },
  { name: "Antalya", slug: "antalya", region: "Akdeniz" },
  { name: "Ardahan", slug: "ardahan", region: "Doğu Anadolu" },
  { name: "Artvin", slug: "artvin", region: "Karadeniz" },
  { name: "Aydın", slug: "aydin", region: "Ege" },
  { name: "Balıkesir", slug: "balikesir", region: "Marmara" },
  { name: "Bartın", slug: "bartin", region: "Karadeniz" },
  { name: "Batman", slug: "batman", region: "Güneydoğu Anadolu" },
  { name: "Bayburt", slug: "bayburt", region: "Karadeniz" },
  { name: "Bilecik", slug: "bilecik", region: "Marmara" },
  { name: "Bingöl", slug: "bingol", region: "Doğu Anadolu" },
  { name: "Bitlis", slug: "bitlis", region: "Doğu Anadolu" },
  { name: "Bolu", slug: "bolu", region: "Karadeniz" },
  { name: "Burdur", slug: "burdur", region: "Akdeniz" },
  { name: "Bursa", slug: "bursa", region: "Marmara" },
  { name: "Çanakkale", slug: "canakkale", region: "Marmara" },
  { name: "Çankırı", slug: "cankiri", region: "İç Anadolu" },
  { name: "Çorum", slug: "corum", region: "Karadeniz" },
  { name: "Denizli", slug: "denizli", region: "Ege" },
  { name: "Diyarbakır", slug: "diyarbakir", region: "Güneydoğu Anadolu" },
  { name: "Düzce", slug: "duzce", region: "Karadeniz" },
  { name: "Edirne", slug: "edirne", region: "Marmara" },
  { name: "Elazığ", slug: "elazig", region: "Doğu Anadolu" },
  { name: "Erzincan", slug: "erzincan", region: "Doğu Anadolu" },
  { name: "Erzurum", slug: "erzurum", region: "Doğu Anadolu" },
  { name: "Eskişehir", slug: "eskisehir", region: "İç Anadolu" },
  { name: "Gaziantep", slug: "gaziantep", region: "Güneydoğu Anadolu" },
  { name: "Giresun", slug: "giresun", region: "Karadeniz" },
  { name: "Gümüşhane", slug: "gumushane", region: "Karadeniz" },
  { name: "Hakkari", slug: "hakkari", region: "Doğu Anadolu" },
  { name: "Hatay", slug: "hatay", region: "Akdeniz" },
  { name: "Iğdır", slug: "igdir", region: "Doğu Anadolu" },
  { name: "Isparta", slug: "isparta", region: "Akdeniz" },
  { name: "İstanbul", slug: "i̇stanbul", region: "Marmara" },
  { name: "İzmir", slug: "i̇zmir", region: "Ege" },
  { name: "Kahramanmaraş", slug: "kahramanmaras", region: "Akdeniz" },
  { name: "Karabük", slug: "karabuk", region: "Karadeniz" },
  { name: "Karaman", slug: "karaman", region: "İç Anadolu" },
  { name: "Kars", slug: "kars", region: "Doğu Anadolu" },
  { name: "Kastamonu", slug: "kastamonu", region: "Karadeniz" },
  { name: "Kayseri", slug: "kayseri", region: "İç Anadolu" },
  { name: "Kilis", slug: "kilis", region: "Güneydoğu Anadolu" },
  { name: "Kırıkkale", slug: "kirikkale", region: "İç Anadolu" },
  { name: "Kırklareli", slug: "kirklareli", region: "Marmara" },
  { name: "Kırşehir", slug: "kirsehir", region: "İç Anadolu" },
  { name: "Kocaeli", slug: "kocaeli", region: "Marmara" },
  { name: "Konya", slug: "konya", region: "İç Anadolu" },
  { name: "Kütahya", slug: "kutahya", region: "Ege" },
  { name: "Malatya", slug: "malatya", region: "Doğu Anadolu" },
  { name: "Manisa", slug: "manisa", region: "Ege" },
  { name: "Mardin", slug: "mardin", region: "Güneydoğu Anadolu" },
  { name: "Mersin", slug: "mersin", region: "Akdeniz" },
  { name: "Muğla", slug: "mugla", region: "Ege" },
  { name: "Muş", slug: "mus", region: "Doğu Anadolu" },
  { name: "Nevşehir", slug: "nevsehir", region: "İç Anadolu" },
  { name: "Niğde", slug: "nigde", region: "İç Anadolu" },
  { name: "Ordu", slug: "ordu", region: "Karadeniz" },
  { name: "Osmaniye", slug: "osmaniye", region: "Akdeniz" },
  { name: "Rize", slug: "rize", region: "Karadeniz" },
  { name: "Sakarya", slug: "sakarya", region: "Marmara" },
  { name: "Samsun", slug: "samsun", region: "Karadeniz" },
  { name: "Siirt", slug: "siirt", region: "Güneydoğu Anadolu" },
  { name: "Sinop", slug: "sinop", region: "Karadeniz" },
  { name: "Sivas", slug: "sivas", region: "İç Anadolu" },
  { name: "Şanlıurfa", slug: "sanliurfa", region: "Güneydoğu Anadolu" },
  { name: "Şırnak", slug: "sirnak", region: "Güneydoğu Anadolu" },
  { name: "Tekirdağ", slug: "tekirdag", region: "Marmara" },
  { name: "Tokat", slug: "tokat", region: "Karadeniz" },
  { name: "Trabzon", slug: "trabzon", region: "Karadeniz" },
  { name: "Tunceli", slug: "tunceli", region: "Doğu Anadolu" },
  { name: "Uşak", slug: "usak", region: "Ege" },
  { name: "Van", slug: "van", region: "Doğu Anadolu" },
  { name: "Yalova", slug: "yalova", region: "Marmara" },
  { name: "Yozgat", slug: "yozgat", region: "İç Anadolu" },
  { name: "Zonguldak", slug: "zonguldak", region: "Karadeniz" },
];
