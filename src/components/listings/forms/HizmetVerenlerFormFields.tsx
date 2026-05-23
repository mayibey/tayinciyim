import { FormSection } from "@/components/listings/forms/FormSection";
import { CityAutocomplete } from "@/components/location/CityAutocomplete";
import { inputClassName, labelClassName } from "@/components/ui/form-styles";
import {
  SERVICE_PRICE_TYPE_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "@/lib/constants/service-labels";

function Check({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy-800">
      <input
        type="checkbox"
        name={name}
        value="1"
        className="rounded border-navy-900/20 text-accent focus:ring-accent"
      />
      {label}
    </label>
  );
}

export function HizmetVerenlerFormFields() {
  return (
    <>
      <FormSection title="Hizmet Bilgisi" description="Verdiğiniz hizmetin türü ve özeti">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Hizmet türü *</label>
            <select name="serviceType" required className={inputClassName} defaultValue="">
              <option value="" disabled>
                Seçin
              </option>
              {SERVICE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassName}>Hizmet başlığı (kısa)</label>
            <input
              name="serviceTitle"
              className={inputClassName}
              placeholder="Örn. Taşınma sonrası detaylı temizlik"
            />
          </div>
        </div>
        <div>
          <label className={labelClassName}>Hizmet açıklaması (detay)</label>
          <textarea
            name="descriptionOfService"
            rows={3}
            className={inputClassName}
            placeholder="Neleri kapsar, ne dahil / hariç?"
          />
        </div>
      </FormSection>

      <FormSection title="Çalışma Bölgesi" description="Hizmet verdiğiniz şehir ve ilçeler">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Ana hizmet şehri *</label>
            <CityAutocomplete name="cityFrom" required placeholder="Ankara" className={inputClassName} />
          </div>
          <div>
            <label className={labelClassName}>Ana ilçe</label>
            <input name="districtFrom" className={inputClassName} placeholder="Çankaya" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClassName}>Hizmet verilen şehirler</label>
            <input
              name="serviceCities"
              className={inputClassName}
              placeholder="Ankara, Etimesgut (virgülle ayırın)"
            />
            <p className="mt-1 text-xs text-muted">Boş bırakırsanız ana şehir kullanılır.</p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClassName}>Hizmet verilen ilçeler</label>
            <input
              name="serviceDistricts"
              className={inputClassName}
              placeholder="Çankaya, Keçiören"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Fiyatlandırma">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Fiyatlandırma tipi *</label>
            <select name="priceType" required className={inputClassName} defaultValue="">
              <option value="" disabled>
                Seçin
              </option>
              {SERVICE_PRICE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassName}>Başlangıç fiyatı (₺)</label>
            <input name="startingPrice" type="number" min={0} className={inputClassName} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Uygunluk / Zaman">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Çalışma günleri</label>
            <input name="workingDays" className={inputClassName} placeholder="Pzt–Cmt" />
          </div>
          <div>
            <label className={labelClassName}>Çalışma saatleri</label>
            <input name="workingHours" className={inputClassName} placeholder="08:00–20:00" />
          </div>
          <div>
            <label className={labelClassName}>Müsaitlik başlangıcı</label>
            <input name="availableFromDate" type="date" className={inputClassName} />
          </div>
          <div>
            <label className={labelClassName}>Ortalama dönüş süresi</label>
            <input name="averageResponseTime" className={inputClassName} placeholder="2 saat" />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Check name="sameDayService" label="Aynı gün hizmet" />
          <Check name="emergencyService" label="Acil / 7-24 hizmet" />
          <Check name="weekendAvailable" label="Hafta sonu çalışır" />
        </div>
      </FormSection>

      <FormSection title="Güven ve Deneyim">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Deneyim (yıl)</label>
            <input name="experienceYears" type="number" min={0} className={inputClassName} />
          </div>
          <div>
            <label className={labelClassName}>Ekip büyüklüğü</label>
            <input name="teamSize" type="number" min={1} className={inputClassName} />
          </div>
        </div>
        <div className="mb-3">
          <Check name="isCompany" label="Firma olarak hizmet veriyorum" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Firma adı</label>
            <input name="companyName" className={inputClassName} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Check name="bringsEquipment" label="Ekipman getirir" />
          <Check name="materialIncluded" label="Malzeme dahil" />
          <Check name="warrantyOffered" label="Garanti verir" />
          <Check name="invoiceAvailable" label="Fatura kesebilir" />
        </div>
      </FormSection>

    </>
  );
}
