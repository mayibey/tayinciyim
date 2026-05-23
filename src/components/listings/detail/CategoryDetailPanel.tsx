import { CapacityBar } from "@/components/listings/CapacityBar";
import { DetailRow, DetailTable } from "@/components/listings/detail/DetailTable";
import {
  ANSWER_STATUS_LABELS,
  FURNISHED_LABELS,
  ITEM_CATEGORY_LABELS,
  ITEM_CONDITION_LABELS,
  LISTING_INTENT_LABELS,
  LOAD_TYPE_LABELS,
  OFFICER_GROUP_LABELS,
  PAYMENT_PREFERENCE_LABELS,
  PRICE_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  REASON_FOR_SALE_LABELS,
  ROOM_COUNT_LABELS,
  VEHICLE_TYPE_LABELS,
} from "@/lib/constants/field-labels";
import { SecurityNotice } from "@/components/listings/SecurityNotice";
import {
  SERVICE_PRICE_TYPE_LABELS,
  SERVICE_TYPE_LABELS,
} from "@/lib/constants/service-labels";
import { SECURITY_MESSAGES } from "@/lib/constants/site";
import { formatServicePrice } from "@/lib/service-format";
import { formatEsyaPrice } from "@/lib/esya-sale";
import type { Listing } from "@/types/listing";

export function CategoryDetailPanel({ listing }: { listing: Listing }) {
  switch (listing.category) {
    case "ev-devri": {
      const d = listing.details;
      return (
        <DetailTable title="Ev özellikleri">
          <DetailRow label="Mahalle" value={d.neighborhood} />
          <DetailRow label="Oda" value={ROOM_COUNT_LABELS[d.roomCount]} />
          <DetailRow label="Kira" value={`${d.rentPrice.toLocaleString("tr-TR")} ₺`} />
          <DetailRow label="Depozito" value={d.deposit?.toLocaleString("tr-TR")} />
          <DetailRow label="Aidat" value={d.dues?.toLocaleString("tr-TR")} />
          <DetailRow label="Eşyalı" value={FURNISHED_LABELS[d.furnished]} />
          <DetailRow label="Kat" value={d.floor} />
          <DetailRow label="Bina yaşı" value={d.buildingAge} />
          <DetailRow label="Isınma" value={d.heatingType} />
          <DetailRow label="Asansör" value={d.hasElevator ? "Var" : "Yok"} />
          <DetailRow label="Balkon" value={d.hasBalcony ? "Var" : "Yok"} />
          <DetailRow label="Otopark" value={d.hasParking ? "Var" : "Yok"} />
          <DetailRow label="Memura uygun" value={d.suitableForOfficer ? "Evet" : "Hayır"} />
          <DetailRow label="Evcil hayvan" value={d.petAllowed ? "İzinli" : "İzinsiz"} />
          <DetailRow label="Çıkış tarihi" value={d.moveOutDate} />
          <DetailRow label="Yakın kurum" value={d.nearbyInstitution} />
          {d.houseFeatures && (
            <DetailRow label="Ek özellikler" value={d.houseFeatures} full />
          )}
        </DetailTable>
      );
    }
    case "esya-devri": {
      const d = listing.details;
      const priceDisplay = formatEsyaPrice(listing);
      return (
        <>
          <DetailTable title="Satış / Devir Detayları">
            <DetailRow label="İlan amacı" value={LISTING_INTENT_LABELS[d.listingIntent]} />
            <DetailRow
              label="İstenen fiyat"
              value={
                d.listingIntent === "ucretsiz"
                  ? "Ücretsiz"
                  : priceDisplay || undefined
              }
            />
            <DetailRow
              label="Orijinal fiyat"
              value={
                d.originalPrice != null
                  ? `${d.originalPrice.toLocaleString("tr-TR")} ₺`
                  : undefined
              }
            />
            <DetailRow label="Pazarlık" value={d.negotiable ? "Var" : "Yok"} />
            <DetailRow
              label="Acil durum"
              value={d.urgentSale || listing.isUrgent ? "Acil" : "Hayır"}
            />
            <DetailRow label="Rezerve tarihi" value={d.canReserveUntil} />
            <DetailRow
              label="Ödeme tercihi"
              value={
                d.paymentPreference
                  ? PAYMENT_PREFERENCE_LABELS[d.paymentPreference]
                  : undefined
              }
            />
            <DetailRow label="Teslim alma notu" value={d.pickupAddressNote} full />
            <DetailRow label="Dahil eşyalar" value={d.itemSetIncluded} full />
            <DetailRow
              label="Satış nedeni"
              value={
                d.reasonForSale ? REASON_FOR_SALE_LABELS[d.reasonForSale] : undefined
              }
            />
          </DetailTable>
          <DetailTable title="Ürün özellikleri">
            <DetailRow label="Tür" value={ITEM_CATEGORY_LABELS[d.itemCategory]} />
            <DetailRow label="Durum" value={ITEM_CONDITION_LABELS[d.condition]} />
            <DetailRow label="Marka" value={d.brand} />
            <DetailRow label="Model" value={d.model} />
            <DetailRow label="Adet" value={d.quantity} />
            <DetailRow label="Garanti" value={d.warrantyAvailable ? "Var" : "Yok"} />
            <DetailRow label="Teslimat" value={d.deliveryIncluded ? "Dahil" : "Yok"} />
            <DetailRow label="Sadece alım" value={d.pickupOnly ? "Evet" : "Hayır"} />
            <DetailRow label="Boyut" value={d.dimensions} />
          </DetailTable>
        </>
      );
    }
    case "nakliye-ariyorum": {
      const d = listing.details;
      return (
        <DetailTable title="Taşıma ihtiyacı">
          <DetailRow label="Yük tipi" value={LOAD_TYPE_LABELS[d.loadType]} />
          <DetailRow label="Hacim tahmini" value={d.loadVolumeEstimate} />
          <DetailRow label="Ortak nakliye" value={d.wantsSharedTruck ? "İstiyor" : "Hayır"} />
          <DetailRow label="Bütçe" value={d.budgetRange} />
          <DetailRow label="Paketleme" value={d.packingNeeded ? "Gerekli" : "Hayır"} />
          <DetailRow label="Sigorta" value={d.insuranceRequested ? "İsteniyor" : "Hayır"} />
          <DetailRow label="Esnek tarih" value={d.flexibleDate ? "Evet" : "Hayır"} />
          <DetailRow label="Çıkış katı" value={d.pickupFloor} />
          <DetailRow label="Varış katı" value={d.deliveryFloor} />
          <DetailRow label="Çıkış asansör" value={d.pickupHasElevator ? "Var" : "Yok"} />
          <DetailRow label="Varış asansör" value={d.deliveryHasElevator ? "Var" : "Yok"} />
          {d.extraNotes && <DetailRow label="Notlar" value={d.extraNotes} full />}
        </DetailTable>
      );
    }
    case "nakliyeci-arac-ilani": {
      const d = listing.details;
      return (
        <div className="card-surface-lg space-y-6 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900">Araç kapasitesi</h2>
          <CapacityBar details={d} size="lg" showBreakdown />
          <DetailTable title="Araç ve hizmet">
            <DetailRow label="Firma" value={d.companyName} />
            <DetailRow label="Araç" value={VEHICLE_TYPE_LABELS[d.vehicleType]} />
            <DetailRow label="Boyut" value={d.vehicleSize} />
            <DetailRow label="Fiyat tipi" value={PRICE_TYPE_LABELS[d.priceType]} />
            <DetailRow label="Taban fiyat" value={d.basePrice?.toLocaleString("tr-TR")} />
            <DetailRow label="Doğrulanmış" value={d.verifiedCarrier ? "Evet" : "Hayır"} />
            <DetailRow label="Sigorta" value={d.hasTransportInsurance ? "Var" : "Yok"} />
            <DetailRow label="Asansör" value={d.hasLift ? "Var" : "Yok"} />
            <DetailRow label="Paketleme" value={d.hasPackingService ? "Var" : "Yok"} />
            <DetailRow label="Montaj" value={d.hasAssemblyService ? "Var" : "Yok"} />
            <DetailRow label="Duraklar" value={d.routeStops} />
            <DetailRow label="Kalkış" value={`${d.departureDate} ${d.departureTimeStart ?? ""}`} />
          </DetailTable>
        </div>
      );
    }
    case "hizmet-verenler": {
      const d = listing.details;
      return (
        <div className="space-y-6">
          <DetailTable title="Hizmet Detayları">
            <DetailRow label="Hizmet türü" value={SERVICE_TYPE_LABELS[d.serviceType]} />
            <DetailRow label="Kısa başlık" value={d.serviceTitle} />
            <DetailRow label="Şehirler" value={d.serviceCities.join(", ")} />
            <DetailRow label="İlçeler" value={d.serviceDistricts?.join(", ")} />
            <DetailRow label="Çalışma günleri" value={d.workingDays} />
            <DetailRow label="Çalışma saatleri" value={d.workingHours} />
            <DetailRow label="Deneyim" value={d.experienceYears != null ? `${d.experienceYears} yıl` : undefined} />
            <DetailRow label="İşletme" value={d.isCompany ? "Firma" : "Bireysel"} />
            <DetailRow label="Firma adı" value={d.companyName} />
            <DetailRow label="Ekip" value={d.teamSize} />
            <DetailRow label="Fiyatlandırma" value={SERVICE_PRICE_TYPE_LABELS[d.priceType]} />
            <DetailRow label="Başlangıç fiyatı" value={formatServicePrice(listing)} />
            <DetailRow label="Aynı gün" value={d.sameDayService ? "Evet" : "Hayır"} />
            <DetailRow label="Acil hizmet" value={d.emergencyService ? "Evet" : "Hayır"} />
            <DetailRow label="Hafta sonu" value={d.weekendAvailable ? "Evet" : "Hayır"} />
            <DetailRow label="Ekipman getirir" value={d.bringsEquipment ? "Evet" : "Hayır"} />
            <DetailRow label="Malzeme dahil" value={d.materialIncluded ? "Evet" : "Hayır"} />
            <DetailRow label="Garanti" value={d.warrantyOffered ? "Var" : "Yok"} />
            <DetailRow label="Fatura" value={d.invoiceAvailable ? "Evet" : "Hayır"} />
            <DetailRow label="Müsaitlik" value={d.availableFromDate} />
            <DetailRow label="Dönüş süresi" value={d.averageResponseTime} />
            {d.descriptionOfService && (
              <DetailRow label="Hizmet kapsamı" value={d.descriptionOfService} full />
            )}
          </DetailTable>
          <SecurityNotice message={SECURITY_MESSAGES.detail} variant="info" />
        </div>
      );
    }
    case "sehir-sorusu": {
      const d = listing.details;
      return (
        <DetailTable title="Soru detayı">
          <DetailRow label="Şehir" value={d.targetCity} />
          <DetailRow label="İlçe" value={d.targetDistrict} />
          <DetailRow label="Soru tipi" value={QUESTION_TYPE_LABELS[d.questionType]} />
          <DetailRow label="Memur grubu" value={OFFICER_GROUP_LABELS[d.officerGroup]} />
          <DetailRow label="Durum" value={ANSWER_STATUS_LABELS[d.answerStatus]} />
        </DetailTable>
      );
    }
  }
}
