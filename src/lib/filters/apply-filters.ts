import type { CategorySlug, Listing } from "@/types/listing";
import { PUBLIC_LISTING_STATUS } from "@/lib/constants/listing-status";
import { resolveListingAuthor } from "@/lib/users/resolve-user";

export type SearchParams = Record<string, string | undefined>;

function matchText(haystack: string, needle?: string): boolean {
  if (!needle?.trim()) return true;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

function matchCheckbox(value: boolean, param?: string): boolean {
  if (!param || param !== "1") return true;
  return value;
}

export function applyListingFilters(
  listings: Listing[],
  category: CategorySlug | undefined,
  params: SearchParams,
): Listing[] {
  let items = listings.filter((l) => l.status === PUBLIC_LISTING_STATUS);

  if (category) {
    items = items.filter((l) => l.category === category);
  }

  const sehir = params.sehir ?? params.nereden;
  const nereye = params.nereye;

  if (sehir) {
    items = items.filter((l) => {
      if (matchText(l.cityFrom, sehir) || matchText(l.districtFrom ?? "", sehir)) {
        return true;
      }
      if (l.category === "sehir-sorusu" && matchText(l.details.targetCity, sehir)) {
        return true;
      }
      if (l.category === "hizmet-verenler") {
        const d = l.details;
        if (d.serviceCities.some((c) => matchText(c, sehir))) return true;
        if (d.serviceDistricts?.some((dist) => matchText(dist, sehir))) return true;
      }
      return false;
    });
  }

  if (nereye) {
    items = items.filter((l) => matchText(l.cityTo ?? "", nereye));
  }

  if (!category) return items;

  switch (category) {
    case "ev-devri":
      return items.filter((l) => {
        if (l.category !== "ev-devri") return false;
        const d = l.details;
        if (params.ilce && !matchText(l.districtFrom ?? "", params.ilce)) return false;
        if (params.oda && d.roomCount !== params.oda) return false;
        if (params.esyali && d.furnished !== params.esyali) return false;
        if (!matchCheckbox(d.hasElevator, params.asansor)) return false;
        if (!matchCheckbox(d.suitableForOfficer, params.memuraUygun)) return false;
        const kiraMin = params.kiraMin ? Number(params.kiraMin) : null;
        const kiraMax = params.kiraMax ? Number(params.kiraMax) : null;
        if (kiraMin != null && !Number.isNaN(kiraMin) && d.rentPrice < kiraMin) return false;
        if (kiraMax != null && !Number.isNaN(kiraMax) && d.rentPrice > kiraMax) return false;
        return true;
      });

    case "esya-devri":
      return items.filter((l) => {
        if (l.category !== "esya-devri") return false;
        const d = l.details;
        if (params.ilanAmaci && d.listingIntent !== params.ilanAmaci) return false;
        if (!matchCheckbox(d.listingIntent === "satilik", params.satilik)) return false;
        if (!matchCheckbox(d.listingIntent === "ucretsiz", params.ucretsiz)) return false;
        if (!matchCheckbox(d.listingIntent === "takas", params.takas)) return false;
        if (!matchCheckbox(d.listingIntent === "komple-ev-esyasi", params.kompleEv))
          return false;
        if (!matchCheckbox(d.negotiable, params.pazarlik)) return false;
        if (!matchCheckbox(d.urgentSale, params.acil)) return false;
        if (params.esyaTuru && d.itemCategory !== params.esyaTuru) return false;
        if (params.durum && d.condition !== params.durum) return false;
        const min = params.fiyatMin ? Number(params.fiyatMin) : null;
        const max = params.fiyatMax ? Number(params.fiyatMax) : null;
        const price = d.askingPrice ?? l.price ?? 0;
        if (d.listingIntent === "ucretsiz" && (params.fiyatMin || params.fiyatMax))
          return false;
        if (min != null && !Number.isNaN(min) && price < min) return false;
        if (max != null && !Number.isNaN(max) && price > max) return false;
        return true;
      });

    case "nakliye-ariyorum":
      return items.filter((l) => {
        if (l.category !== "nakliye-ariyorum") return false;
        const d = l.details;
        if (params.yukTipi && d.loadType !== params.yukTipi) return false;
        if (!matchCheckbox(d.wantsSharedTruck, params.ortakNakliye)) return false;
        const elev =
          d.elevatorNeededAtPickup || d.elevatorNeededAtDelivery;
        if (!matchCheckbox(elev, params.asansorGerekli)) return false;
        if (params.tarih && l.availableDate && !l.availableDate.startsWith(params.tarih))
          return false;
        return true;
      });

    case "nakliyeci-arac-ilani":
      return items.filter((l) => {
        if (l.category !== "nakliyeci-arac-ilani") return false;
        const d = l.details;
        if (params.aracTipi && d.vehicleType !== params.aracTipi) return false;
        if (!matchCheckbox(d.hasTransportInsurance, params.sigortali)) return false;
        if (!matchCheckbox(d.hasLift, params.asansorlu)) return false;
        if (!matchCheckbox(d.hasPackingService, params.paketleme)) return false;
        const minKap = params.minKapasite ? Number(params.minKapasite) : null;
        if (
          minKap != null &&
          !Number.isNaN(minKap) &&
          d.availableCapacityPercent < minKap
        )
          return false;
        if (params.tarih && !d.departureDate.startsWith(params.tarih)) return false;
        return true;
      });

    case "sehir-sorusu":
      return items.filter((l) => {
        if (l.category !== "sehir-sorusu") return false;
        const d = l.details;
        if (params.ilce && !matchText(d.targetDistrict ?? "", params.ilce)) return false;
        if (params.soruTipi && d.questionType !== params.soruTipi) return false;
        if (params.memurGrubu && d.officerGroup !== params.memurGrubu) return false;
        if (params.cevapDurumu && d.answerStatus !== params.cevapDurumu) return false;
        return true;
      });

    case "hizmet-verenler":
      return items.filter((l) => {
        if (l.category !== "hizmet-verenler") return false;
        const d = l.details;
        const author = resolveListingAuthor(l);
        if (params.hizmetTuru && d.serviceType !== params.hizmetTuru) return false;
        if (params.ilce) {
          const inDistrict =
            matchText(l.districtFrom ?? "", params.ilce) ||
            d.serviceDistricts?.some((dist) => matchText(dist, params.ilce!));
          if (!inDistrict) return false;
        }
        if (!matchCheckbox(d.sameDayService, params.ayniGun)) return false;
        if (!matchCheckbox(d.weekendAvailable, params.haftaSonu)) return false;
        if (!matchCheckbox(d.bringsEquipment, params.ekipman)) return false;
        if (!matchCheckbox(d.invoiceAvailable, params.fatura)) return false;
        if (params.isletmeTipi === "firma" && !d.isCompany) return false;
        if (params.isletmeTipi === "bireysel" && d.isCompany) return false;
        if (params.fiyatTipi && d.priceType !== params.fiyatTipi) return false;
        const minPuan = params.minPuan ? Number(params.minPuan) : null;
        if (minPuan != null && !Number.isNaN(minPuan) && author.ratingAverage < minPuan) {
          return false;
        }
        const guvenMin = params.guvenMin ? Number(params.guvenMin) : null;
        if (guvenMin != null && !Number.isNaN(guvenMin) && author.trustScore < guvenMin) {
          return false;
        }
        return true;
      });

    default:
      return items;
  }
}
