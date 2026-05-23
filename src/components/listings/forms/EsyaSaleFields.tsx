"use client";

import { useState } from "react";
import { FormSection } from "@/components/listings/forms/FormSection";
import {
  LISTING_INTENT_LABELS,
  PAYMENT_PREFERENCE_LABELS,
  REASON_FOR_SALE_LABELS,
} from "@/lib/constants/field-labels";
import { intentRequiresPrice } from "@/lib/esya-sale";
import type { ListingIntent } from "@/types/listing-fields";
import { inputClassName, labelClassName } from "@/components/ui/form-styles";

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

export function EsyaSaleFields() {
  const [intent, setIntent] = useState<ListingIntent | "">("");

  const needsPrice = intent ? intentRequiresPrice(intent) : false;
  const isFree = intent === "ucretsiz";
  const isSwap = intent === "takas";

  return (
    <>
      <FormSection title="Satış / Devir Bilgileri" description="İlan amacı ve fiyatlandırma">
        <div>
          <label className={labelClassName}>İlan amacı *</label>
          <select
            name="listingIntent"
            required
            className={inputClassName}
            defaultValue=""
            onChange={(e) => setIntent(e.target.value as ListingIntent)}
          >
            <option value="" disabled>
              Seçin
            </option>
            {Object.entries(LISTING_INTENT_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {isSwap && (
          <p className="rounded-xl bg-cream-100 px-4 py-3 text-sm text-navy-800">
            Takas ilanında açıklama alanında neyle takas etmek istediğinizi ayrıntılı yazın
            (en az 30 karakter).
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>
              İstenen fiyat (₺)
              {needsPrice && !isFree ? " *" : ""}
            </label>
            <input
              name="askingPrice"
              type="number"
              min={0}
              required={needsPrice && !isFree}
              disabled={isFree}
              className={inputClassName}
              placeholder={isFree ? "Ücretsiz ilan" : "örn. 8500"}
            />
          </div>
          <div>
            <label className={labelClassName}>Orijinal fiyat (₺)</label>
            <input
              name="originalPrice"
              type="number"
              min={0}
              disabled={isFree}
              className={inputClassName}
            />
          </div>
          <div>
            <label className={labelClassName}>Ödeme tercihi</label>
            <select name="paymentPreference" className={inputClassName} defaultValue="">
              <option value="">Seçin</option>
              {Object.entries(PAYMENT_PREFERENCE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassName}>Satış nedeni</label>
            <select name="reasonForSale" className={inputClassName} defaultValue="">
              <option value="">Seçin</option>
              {Object.entries(REASON_FOR_SALE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassName}>Rezerve edilebilir (tarihe kadar)</label>
            <input name="canReserveUntil" type="date" className={inputClassName} />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Check name="negotiable" label="Pazarlık var mı?" />
          <Check name="urgentSale" label="Acil satış" />
        </div>

        <div>
          <label className={labelClassName}>Teslim alma / adres notu</label>
          <textarea
            name="pickupAddressNote"
            rows={2}
            className={inputClassName}
            placeholder="Mahalle, bina, randevu saati..."
          />
        </div>

        <div>
          <label className={labelClassName}>Dahil olan eşyalar</label>
          <textarea
            name="itemSetIncluded"
            rows={2}
            className={inputClassName}
            placeholder="Pakete neler dahil?"
          />
        </div>
      </FormSection>
    </>
  );
}
