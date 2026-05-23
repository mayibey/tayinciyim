import { getCategoryConfig } from "@/lib/categories";
import { listingRequiresPhotos } from "@/lib/listing-images";
import {
  normalizeAndValidateMobile,
} from "@/lib/security/phone";
import {
  sanitizeListingDescription,
  sanitizeListingTitle,
  sanitizePlainText,
} from "@/lib/security/sanitize";
import type { CategorySlug, CreateListingInput, ListingImage } from "@/types/listing";
import { intentRequiresPrice } from "@/lib/esya-sale";
import type {
  EsyaDevriDetails,
  EvDevriDetails,
  HizmetVerenlerDetails,
  ListingIntent,
  NakliyeAriyorumDetails,
  NakliyeciAracDetails,
  PaymentPreference,
  ReasonForSale,
  SehirSorusuDetails,
} from "@/types/listing-fields";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "1" || fd.get(key) === "on";
}

function csvList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function num(fd: FormData, key: string): number | undefined {
  const v = str(fd, key);
  if (!v) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

export function parseListingForm(
  fd: FormData,
  imageCount: number,
): { ok: true; data: CreateListingInput } | { ok: false; message: string } {
  const category = str(fd, "category") as CategorySlug;
  const config = getCategoryConfig(category);
  if (!config) {
    return { ok: false, message: "Geçerli bir kategori seçin." };
  }

  const title = sanitizeListingTitle(str(fd, "title"));
  const description = sanitizeListingDescription(str(fd, "description"));
  const contactName = sanitizePlainText(str(fd, "contactName"), 80);
  const phoneRaw = str(fd, "whatsapp");
  const phone = normalizeAndValidateMobile(phoneRaw);

  if (title.length < 8) return { ok: false, message: "Başlık en az 8 karakter olmalıdır." };
  if (description.length < 20) return { ok: false, message: "Açıklama en az 20 karakter olmalıdır." };
  if (!contactName) return { ok: false, message: "İletişim adı zorunludur." };
  if (!phone.ok) {
    return { ok: false, message: "Geçerli bir WhatsApp numarası girin (05XX XXX XX XX)." };
  }

  if (listingRequiresPhotos(category) && imageCount < config.minPhotos) {
    return { ok: false, message: `Bu kategori için en az ${config.minPhotos} fotoğraf yükleyin.` };
  }

  const base = {
    category,
    title,
    description,
    contactName,
    whatsapp: phone.value,
    cityFrom: str(fd, "cityFrom"),
    districtFrom: str(fd, "districtFrom") || undefined,
    cityTo: str(fd, "cityTo") || undefined,
    districtTo: str(fd, "districtTo") || undefined,
    availableDate: str(fd, "availableDate") || undefined,
    availableTimeStart: str(fd, "availableTimeStart") || undefined,
    availableTimeEnd: str(fd, "availableTimeEnd") || undefined,
    price: num(fd, "price"),
    images: [] as ListingImage[],
    isUrgent: bool(fd, "isUrgent"),
    isFeatured: false,
  };

  if (!base.cityFrom) return { ok: false, message: "Şehir (çıkış) zorunludur." };
  if (config.requiresRoute && !base.cityTo) {
    return { ok: false, message: "Varış şehri zorunludur." };
  }

  switch (category) {
    case "ev-devri": {
      const rentPrice = num(fd, "rentPrice");
      if (!rentPrice) return { ok: false, message: "Kira bedeli zorunludur." };
      const details: EvDevriDetails = {
        neighborhood: str(fd, "neighborhood"),
        roomCount: str(fd, "roomCount") as EvDevriDetails["roomCount"],
        floor: num(fd, "floor"),
        buildingAge: num(fd, "buildingAge"),
        rentPrice,
        deposit: num(fd, "deposit"),
        dues: num(fd, "dues"),
        furnished: (str(fd, "furnished") || "hayır") as EvDevriDetails["furnished"],
        heatingType: str(fd, "heatingType") || undefined,
        hasElevator: bool(fd, "hasElevator"),
        hasBalcony: bool(fd, "hasBalcony"),
        hasParking: bool(fd, "hasParking"),
        familyFriendly: bool(fd, "familyFriendly"),
        suitableForOfficer: bool(fd, "suitableForOfficer"),
        moveOutDate: str(fd, "moveOutDate") || undefined,
        landlordContactAvailable: bool(fd, "landlordContactAvailable"),
        petAllowed: bool(fd, "petAllowed"),
        nearbyInstitution: str(fd, "nearbyInstitution") || undefined,
        houseFeatures: str(fd, "houseFeatures") || undefined,
        approximateLocationNote: str(fd, "approximateLocationNote") || undefined,
        nearInstitutionProximity: bool(fd, "nearInstitutionProximity"),
        nearSchool: bool(fd, "nearSchool"),
        nearMarket: bool(fd, "nearMarket"),
        nearPublicTransport: bool(fd, "nearPublicTransport"),
        nearParkOrSocial: bool(fd, "nearParkOrSocial"),
        estimatedDistanceToCenterKm: num(fd, "estimatedDistanceToCenterKm"),
      };
      if (!details.neighborhood) return { ok: false, message: "Mahalle zorunludur." };
      if (!details.roomCount) return { ok: false, message: "Oda sayısı seçin." };
      return { ok: true, data: { ...base, category, details } };
    }
    case "esya-devri": {
      const listingIntent = str(fd, "listingIntent") as ListingIntent;
      const askingPrice = num(fd, "askingPrice");
      const originalPrice = num(fd, "originalPrice");

      if (!listingIntent) {
        return { ok: false, message: "İlan amacı seçmeniz zorunludur." };
      }

      if (listingIntent === "takas" && description.length < 30) {
        return {
          ok: false,
          message:
            "Takas ilanlarında açıklamada neyle takas etmek istediğinizi en az 30 karakter ile belirtin.",
        };
      }

      if (intentRequiresPrice(listingIntent)) {
        if (askingPrice == null || askingPrice <= 0) {
          return {
            ok: false,
            message:
              "Satılık ve komple ev eşyası ilanlarında istenen fiyat girmeniz gerekir.",
          };
        }
      }

      const details: EsyaDevriDetails = {
        itemCategory: str(fd, "itemCategory") as EsyaDevriDetails["itemCategory"],
        condition: str(fd, "condition") as EsyaDevriDetails["condition"],
        listingIntent,
        originalPrice: listingIntent === "ucretsiz" ? undefined : originalPrice,
        askingPrice: listingIntent === "ucretsiz" ? undefined : askingPrice,
        negotiable: bool(fd, "negotiable"),
        urgentSale: bool(fd, "urgentSale"),
        canReserveUntil: str(fd, "canReserveUntil") || undefined,
        pickupAddressNote: str(fd, "pickupAddressNote") || undefined,
        paymentPreference:
          (str(fd, "paymentPreference") as PaymentPreference) || undefined,
        itemSetIncluded: str(fd, "itemSetIncluded") || undefined,
        reasonForSale: (str(fd, "reasonForSale") as ReasonForSale) || undefined,
        brand: str(fd, "brand") || undefined,
        model: str(fd, "model") || undefined,
        warrantyAvailable: bool(fd, "warrantyAvailable"),
        deliveryIncluded: bool(fd, "deliveryIncluded"),
        pickupOnly: bool(fd, "pickupOnly"),
        bulkSale: bool(fd, "bulkSale"),
        itemAge: str(fd, "itemAge") || undefined,
        quantity: num(fd, "quantity") ?? 1,
        dimensions: str(fd, "dimensions") || undefined,
      };
      if (!details.itemCategory) return { ok: false, message: "Eşya türü seçin." };

      const price =
        listingIntent === "ucretsiz" ? 0 : (askingPrice ?? base.price);

      return {
        ok: true,
        data: { ...base, category, price, details },
      };
    }
    case "nakliye-ariyorum": {
      const details: NakliyeAriyorumDetails = {
        loadType: str(fd, "loadType") as NakliyeAriyorumDetails["loadType"],
        loadVolumeEstimate: str(fd, "loadVolumeEstimate") || undefined,
        elevatorNeededAtPickup: bool(fd, "elevatorNeededAtPickup"),
        elevatorNeededAtDelivery: bool(fd, "elevatorNeededAtDelivery"),
        packingNeeded: bool(fd, "packingNeeded"),
        insuranceRequested: bool(fd, "insuranceRequested"),
        flexibleDate: bool(fd, "flexibleDate"),
        preferredVehicleType: str(fd, "preferredVehicleType") || undefined,
        pickupFloor: num(fd, "pickupFloor"),
        deliveryFloor: num(fd, "deliveryFloor"),
        pickupHasElevator: bool(fd, "pickupHasElevator"),
        deliveryHasElevator: bool(fd, "deliveryHasElevator"),
        extraNotes: str(fd, "extraNotes") || undefined,
        wantsSharedTruck: bool(fd, "wantsSharedTruck"),
        budgetRange: str(fd, "budgetRange") || undefined,
      };
      if (!details.loadType) return { ok: false, message: "Yük tipi seçin." };
      return { ok: true, data: { ...base, category, details } };
    }
    case "nakliyeci-arac-ilani": {
      const used = num(fd, "usedCapacityPercent") ?? 50;
      const details: NakliyeciAracDetails = {
        companyName: str(fd, "companyName") || undefined,
        vehicleType: str(fd, "vehicleType") as NakliyeciAracDetails["vehicleType"],
        vehicleSize: str(fd, "vehicleSize") || undefined,
        totalCapacityM3: num(fd, "totalCapacityM3") ?? 20,
        usedCapacityPercent: used,
        availableCapacityPercent: Math.max(0, 100 - used),
        canTakeRoomEquivalent: (str(fd, "canTakeRoomEquivalent") || "parca") as NakliyeciAracDetails["canTakeRoomEquivalent"],
        hasLift: bool(fd, "hasLift"),
        hasTransportInsurance: bool(fd, "hasTransportInsurance"),
        hasPackingService: bool(fd, "hasPackingService"),
        hasAssemblyService: bool(fd, "hasAssemblyService"),
        routeStops: str(fd, "routeStops") || undefined,
        departureDate: str(fd, "departureDate"),
        departureTimeStart: str(fd, "departureTimeStart") || undefined,
        departureTimeEnd: str(fd, "departureTimeEnd") || undefined,
        priceType: (str(fd, "priceType") || "teklif-al") as NakliyeciAracDetails["priceType"],
        basePrice: num(fd, "basePrice"),
        verifiedCarrier: bool(fd, "verifiedCarrier"),
      };
      if (!details.vehicleType) return { ok: false, message: "Araç tipi seçin." };
      if (!details.departureDate) return { ok: false, message: "Kalkış tarihi zorunludur." };
      return { ok: true, data: { ...base, category, details } };
    }
    case "hizmet-verenler": {
      const serviceType = str(fd, "serviceType") as HizmetVerenlerDetails["serviceType"];
      const priceType = str(fd, "priceType") as HizmetVerenlerDetails["priceType"];
      if (!serviceType) return { ok: false, message: "Hizmet türü seçin." };
      if (!priceType) return { ok: false, message: "Fiyatlandırma tipi seçin." };

      const citiesRaw = str(fd, "serviceCities");
      const serviceCities = citiesRaw.length > 0 ? csvList(citiesRaw) : [base.cityFrom];
      const districtsRaw = str(fd, "serviceDistricts");
      const serviceDistricts = districtsRaw ? csvList(districtsRaw) : undefined;

      const details: HizmetVerenlerDetails = {
        serviceType,
        serviceTitle: sanitizePlainText(str(fd, "serviceTitle"), 120) || undefined,
        serviceCities,
        serviceDistricts,
        workingDays: str(fd, "workingDays") || undefined,
        workingHours: str(fd, "workingHours") || undefined,
        experienceYears: num(fd, "experienceYears"),
        isCompany: bool(fd, "isCompany"),
        companyName: sanitizePlainText(str(fd, "companyName"), 80) || undefined,
        teamSize: num(fd, "teamSize"),
        priceType,
        startingPrice: num(fd, "startingPrice"),
        emergencyService: bool(fd, "emergencyService"),
        sameDayService: bool(fd, "sameDayService"),
        weekendAvailable: bool(fd, "weekendAvailable"),
        bringsEquipment: bool(fd, "bringsEquipment"),
        materialIncluded: bool(fd, "materialIncluded"),
        warrantyOffered: bool(fd, "warrantyOffered"),
        invoiceAvailable: bool(fd, "invoiceAvailable"),
        descriptionOfService:
          sanitizePlainText(str(fd, "descriptionOfService"), 2000) || undefined,
        availableFromDate: str(fd, "availableFromDate") || undefined,
        averageResponseTime: str(fd, "averageResponseTime") || undefined,
      };

      return {
        ok: true,
        data: {
          ...base,
          category,
          price: details.startingPrice,
          details,
        },
      };
    }
    case "sehir-sorusu": {
      const targetCity = str(fd, "targetCity");
      const details: SehirSorusuDetails = {
        targetCity,
        targetDistrict: str(fd, "targetDistrict") || undefined,
        questionType: str(fd, "questionType") as SehirSorusuDetails["questionType"],
        officerGroup: str(fd, "officerGroup") as SehirSorusuDetails["officerGroup"],
        answerStatus: "cevap-bekliyor",
      };
      if (!targetCity) return { ok: false, message: "Hedef şehir zorunludur." };
      if (!details.questionType) return { ok: false, message: "Soru tipi seçin." };
      return {
        ok: true,
        data: {
          ...base,
          category,
          cityFrom: targetCity,
          districtFrom: details.targetDistrict,
          details,
        },
      };
    }
    default:
      return { ok: false, message: "Desteklenmeyen kategori." };
  }
}
