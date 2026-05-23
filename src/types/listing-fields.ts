/** Ev Devri */
export type RoomCount = "1+0" | "1+1" | "2+1" | "3+1" | "4+1" | "5+1";
export type FurnishedStatus = "evet" | "hayır" | "kısmen";

export interface EvDevriDetails {
  neighborhood: string;
  roomCount: RoomCount;
  floor?: number;
  buildingAge?: number;
  rentPrice: number;
  deposit?: number;
  dues?: number;
  furnished: FurnishedStatus;
  heatingType?: string;
  hasElevator: boolean;
  hasBalcony: boolean;
  hasParking: boolean;
  familyFriendly: boolean;
  suitableForOfficer: boolean;
  moveOutDate?: string;
  landlordContactAvailable: boolean;
  petAllowed: boolean;
  nearbyInstitution?: string;
  houseFeatures?: string;
  /** Konum ve çevre — tam adres paylaşılmaz */
  approximateLocationNote?: string;
  nearInstitutionProximity?: boolean;
  nearSchool?: boolean;
  nearMarket?: boolean;
  nearPublicTransport?: boolean;
  nearParkOrSocial?: boolean;
  estimatedDistanceToCenterKm?: number;
}

/** Eşya Devri */
export type ItemCategory =
  | "beyaz-esya"
  | "mobilya"
  | "cocuk-bebek"
  | "elektronik"
  | "mutfak"
  | "hali-perde"
  | "komple-ev-esyasi"
  | "ucretsiz";

export type ItemCondition = "yeni" | "az-kullanilmis" | "kullanilmis" | "tamir-gerekir";

export type ListingIntent =
  | "satilik"
  | "devredilecek"
  | "ucretsiz"
  | "takas"
  | "komple-ev-esyasi";

export type PaymentPreference = "nakit" | "havale" | "elden" | "fark-etmez";

export type ReasonForSale =
  | "tayin"
  | "ev-kucultme"
  | "yenileme"
  | "ihtiyac-fazlasi"
  | "diger";

export interface EsyaDevriDetails {
  itemCategory: ItemCategory;
  condition: ItemCondition;
  listingIntent: ListingIntent;
  originalPrice?: number;
  askingPrice?: number;
  negotiable: boolean;
  urgentSale: boolean;
  canReserveUntil?: string;
  pickupAddressNote?: string;
  paymentPreference?: PaymentPreference;
  itemSetIncluded?: string;
  reasonForSale?: ReasonForSale;
  brand?: string;
  model?: string;
  warrantyAvailable: boolean;
  deliveryIncluded: boolean;
  pickupOnly: boolean;
  bulkSale: boolean;
  itemAge?: string;
  quantity: number;
  dimensions?: string;
}

/** Nakliye Arıyorum */
export type LoadType =
  | "parca-esya"
  | "1+1"
  | "2+1"
  | "3+1"
  | "4+1"
  | "komple-ev"
  | "beyaz-esya"
  | "koli"
  | "ofis";

export interface NakliyeAriyorumDetails {
  loadType: LoadType;
  loadVolumeEstimate?: string;
  elevatorNeededAtPickup: boolean;
  elevatorNeededAtDelivery: boolean;
  packingNeeded: boolean;
  insuranceRequested: boolean;
  flexibleDate: boolean;
  preferredVehicleType?: string;
  pickupFloor?: number;
  deliveryFloor?: number;
  pickupHasElevator: boolean;
  deliveryHasElevator: boolean;
  extraNotes?: string;
  wantsSharedTruck: boolean;
  budgetRange?: string;
}

/** Nakliyeci Araç */
export type VehicleType = "panelvan" | "kamyonet" | "kamyon" | "tir";
export type RoomEquivalent = "parca" | "1+1" | "2+1" | "3+1";
export type PriceType = "teklif-al" | "sabit-fiyat" | "masraf-paylasimi";

export interface NakliyeciAracDetails {
  companyName?: string;
  vehicleType: VehicleType;
  vehicleSize?: string;
  totalCapacityM3: number;
  usedCapacityPercent: number;
  availableCapacityPercent: number;
  canTakeRoomEquivalent: RoomEquivalent;
  hasLift: boolean;
  hasTransportInsurance: boolean;
  hasPackingService: boolean;
  hasAssemblyService: boolean;
  routeStops?: string;
  departureDate: string;
  departureTimeStart?: string;
  departureTimeEnd?: string;
  estimatedArrivalDate?: string;
  estimatedArrivalTime?: string;
  priceType: PriceType;
  basePrice?: number;
  verifiedCarrier: boolean;
}

/** Şehir Sorusu */
export type QuestionType =
  | "mahalle"
  | "okul"
  | "ulasim"
  | "kira"
  | "guvenlik"
  | "kurum-cevresi"
  | "lojman"
  | "genel";

export type OfficerGroup =
  | "ogretmen"
  | "polis"
  | "jandarma"
  | "saglikci"
  | "imam"
  | "zabita"
  | "diger";

export type AnswerStatus = "cevap-bekliyor" | "cevaplandi";

export interface SehirSorusuDetails {
  targetCity: string;
  targetDistrict?: string;
  questionType: QuestionType;
  officerGroup: OfficerGroup;
  answerStatus: AnswerStatus;
}

/** Hizmet Verenler */
export type ServiceType =
  | "temizlik"
  | "boya-badana"
  | "ev-onarim"
  | "tesisat"
  | "elektrik"
  | "mobilya-montaj"
  | "perde-kornis"
  | "klima-servisi"
  | "internet-uydu"
  | "nakliye-yardimci-personel"
  | "anahtar-cilingir"
  | "diger";

export type ServicePriceType =
  | "sabit-fiyat"
  | "teklif-al"
  | "saatlik"
  | "gunluk"
  | "is-basina";

export interface HizmetVerenlerDetails {
  serviceType: ServiceType;
  serviceTitle?: string;
  serviceCities: string[];
  serviceDistricts?: string[];
  workingDays?: string;
  workingHours?: string;
  experienceYears?: number;
  isCompany: boolean;
  companyName?: string;
  teamSize?: number;
  priceType: ServicePriceType;
  startingPrice?: number;
  emergencyService: boolean;
  sameDayService: boolean;
  weekendAvailable: boolean;
  bringsEquipment: boolean;
  materialIncluded: boolean;
  warrantyOffered: boolean;
  invoiceAvailable: boolean;
  descriptionOfService?: string;
  previousWorkPhotos?: string[];
  availableFromDate?: string;
  averageResponseTime?: string;
}
