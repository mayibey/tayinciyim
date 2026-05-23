import { EsyaSaleFields } from "@/components/listings/forms/EsyaSaleFields";
import { FormSection } from "@/components/listings/forms/FormSection";
import {
  FURNISHED_LABELS,
  ITEM_CATEGORY_LABELS,
  ITEM_CONDITION_LABELS,
  LOAD_TYPE_LABELS,
  OFFICER_GROUP_LABELS,
  PRICE_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  ROOM_COUNT_LABELS,
  ROOM_EQUIVALENT_LABELS,
  VEHICLE_TYPE_LABELS,
} from "@/lib/constants/field-labels";
import { HizmetVerenlerFormFields } from "@/components/listings/forms/HizmetVerenlerFormFields";
import { SecurityNotice } from "@/components/listings/SecurityNotice";
import { FORM_ADDRESS_PRIVACY_WARNING } from "@/lib/constants/location-disclaimer";
import { inputClassName, labelClassName } from "@/components/ui/form-styles";
import type { CategorySlug } from "@/types/listing";

function Check({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy-800">
      <input type="checkbox" name={name} value="1" className="rounded border-navy-900/20 text-accent focus:ring-accent" />
      {label}
    </label>
  );
}

export function CategoryFormFields({ category }: { category: CategorySlug }) {
  switch (category) {
    case "ev-devri":
      return (
        <>
        <FormSection title="Kategoriye Özel Detaylar" description="Ev devri bilgileri">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>Mahalle *</label>
              <input name="neighborhood" required className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Oda sayısı *</label>
              <select name="roomCount" required className={inputClassName} defaultValue="">
                <option value="" disabled>Seçin</option>
                {Object.entries(ROOM_COUNT_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Kira (₺) *</label>
              <input name="rentPrice" type="number" required min={0} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Depozito (₺)</label>
              <input name="deposit" type="number" min={0} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Eşyalı *</label>
              <select name="furnished" required className={inputClassName} defaultValue="evet">
                {Object.entries(FURNISHED_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Kat</label>
              <input name="floor" type="number" className={inputClassName} />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Check name="hasElevator" label="Asansör var" />
            <Check name="hasBalcony" label="Balkon var" />
            <Check name="hasParking" label="Otopark var" />
            <Check name="suitableForOfficer" label="Memura uygun" />
            <Check name="petAllowed" label="Evcil hayvan izinli" />
            <Check name="landlordContactAvailable" label="Ev sahibi iletişimi var" />
          </div>
          <div>
            <label className={labelClassName}>Ev özellikleri</label>
            <textarea name="houseFeatures" rows={3} className={inputClassName} />
          </div>
          <div>
            <label className={labelClassName}>Yakın kurum / kurum notu</label>
            <input name="nearbyInstitution" className={inputClassName} placeholder="Örn. Bakanlık binasına 10 dk" />
          </div>
        </FormSection>

        <FormSection
          title="Konum ve Çevre Bilgisi"
          description="Mahalle ve çevre — tam adres zorunlu değildir"
        >
          <SecurityNotice message={FORM_ADDRESS_PRIVACY_WARNING} variant="info" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClassName}>Yaklaşık konum / adres notu</label>
              <textarea
                name="approximateLocationNote"
                rows={2}
                className={inputClassName}
                placeholder="Örn. site içi, ana caddeye 2 dk"
              />
            </div>
            <div>
              <label className={labelClassName}>Şehir merkezine tahmini mesafe (km)</label>
              <input
                name="estimatedDistanceToCenterKm"
                type="number"
                min={0}
                step={0.5}
                className={inputClassName}
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Check name="nearInstitutionProximity" label="Kuruma yakın" />
            <Check name="nearSchool" label="Yakın okul var" />
            <Check name="nearMarket" label="Yakın market var" />
            <Check name="nearPublicTransport" label="Toplu taşıma yakın" />
            <Check name="nearParkOrSocial" label="Park / sosyal alan yakın" />
          </div>
        </FormSection>
        </>
      );
    case "esya-devri":
      return (
        <>
          <FormSection title="Kategoriye Özel Detaylar" description="Ürün bilgileri">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>Eşya türü *</label>
                <select name="itemCategory" required className={inputClassName} defaultValue="">
                  <option value="" disabled>Seçin</option>
                  {Object.entries(ITEM_CATEGORY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Durum *</label>
                <select name="condition" required className={inputClassName} defaultValue="kullanilmis">
                  {Object.entries(ITEM_CONDITION_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Adet</label>
                <input name="quantity" type="number" min={1} defaultValue={1} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Marka</label>
                <input name="brand" className={inputClassName} />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Check name="pickupOnly" label="Sadece yerinden alım" />
              <Check name="bulkSale" label="Toplu satış" />
              <Check name="deliveryIncluded" label="Teslimat dahil" />
              <Check name="warrantyAvailable" label="Garanti var" />
            </div>
          </FormSection>
          <EsyaSaleFields />
        </>
      );
    case "nakliye-ariyorum":
      return (
        <FormSection title="Kategoriye Özel Detaylar" description="Taşıma ihtiyacı">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>Yük tipi *</label>
              <select name="loadType" required className={inputClassName} defaultValue="">
                <option value="" disabled>Seçin</option>
                {Object.entries(LOAD_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Bütçe aralığı</label>
              <input name="budgetRange" className={inputClassName} placeholder="örn. 5.000 – 8.000 TL" />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Check name="wantsSharedTruck" label="Ortak nakliye istiyorum" />
            <Check name="packingNeeded" label="Paketleme gerekli" />
            <Check name="insuranceRequested" label="Sigorta istiyorum" />
            <Check name="flexibleDate" label="Tarih esnek" />
            <Check name="elevatorNeededAtPickup" label="Çıkışta asansör gerekli" />
            <Check name="elevatorNeededAtDelivery" label="Varışta asansör gerekli" />
          </div>
          <div>
            <label className={labelClassName}>Ek notlar</label>
            <textarea name="extraNotes" rows={3} className={inputClassName} />
          </div>
        </FormSection>
      );
    case "nakliyeci-arac-ilani":
      return (
        <FormSection title="Kategoriye Özel Detaylar" description="Araç ve kapasite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>Firma adı</label>
              <input name="companyName" className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Araç tipi *</label>
              <select name="vehicleType" required className={inputClassName} defaultValue="">
                <option value="" disabled>Seçin</option>
                {Object.entries(VEHICLE_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Toplam hacim (m³)</label>
              <input name="totalCapacityM3" type="number" min={1} defaultValue={20} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Doluluk (%) *</label>
              <input name="usedCapacityPercent" type="number" min={0} max={100} defaultValue={50} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Alabileceği eşya</label>
              <select name="canTakeRoomEquivalent" className={inputClassName} defaultValue="1+1">
                {Object.entries(ROOM_EQUIVALENT_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Kalkış tarihi *</label>
              <input name="departureDate" type="date" required className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Fiyat tipi</label>
              <select name="priceType" className={inputClassName} defaultValue="teklif-al">
                {Object.entries(PRICE_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Check name="hasLift" label="Asansör / lift var" />
            <Check name="hasTransportInsurance" label="Taşıma sigortası" />
            <Check name="hasPackingService" label="Paketleme hizmeti" />
            <Check name="verifiedCarrier" label="Doğrulanmış taşıyıcı" />
          </div>
        </FormSection>
      );
    case "hizmet-verenler":
      return <HizmetVerenlerFormFields />;
    case "sehir-sorusu":
      return (
        <FormSection title="Kategoriye Özel Detaylar" description="Soru bilgileri">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>Hedef şehir *</label>
              <input name="targetCity" required className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Hedef ilçe</label>
              <input name="targetDistrict" className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Soru tipi *</label>
              <select name="questionType" required className={inputClassName} defaultValue="">
                <option value="" disabled>Seçin</option>
                {Object.entries(QUESTION_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>Memur grubu *</label>
              <select name="officerGroup" required className={inputClassName} defaultValue="ogretmen">
                {Object.entries(OFFICER_GROUP_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </FormSection>
      );
  }
}
