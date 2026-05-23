"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { createListingAction } from "@/app/ilan-ver/actions";
import { CategoryFormFields } from "@/components/listings/forms/CategoryFormFields";
import { FormSection } from "@/components/listings/forms/FormSection";
import { ListingImageUpload, type LocalPreviewImage } from "@/components/listings/ListingImageUpload";
import { SecurityNotice } from "@/components/listings/SecurityNotice";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { CATEGORIES, getCategoryConfig } from "@/lib/categories";
import { listingRequiresPhotos } from "@/lib/listing-images";
import { SECURITY_MESSAGES } from "@/lib/constants/site";
import { HoneypotFields } from "@/components/security/HoneypotFields";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { inputClassName, labelClassName } from "@/components/ui/form-styles";
import type { CategorySlug } from "@/types/listing";

const initialState = { ok: false as boolean, message: "" };

export function DynamicListingForm() {
  const { toast } = useToast();
  const [category, setCategory] = useState<CategorySlug | "">("");
  const [images, setImages] = useState<LocalPreviewImage[]>([]);
  const [state, formAction, pending] = useActionState(createListingAction, initialState);
  const [, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    images.forEach((img) => fd.append("listingImages", img.file));
    startTransition(() => {
      formAction(fd);
    });
  };

  const config = category ? getCategoryConfig(category) : undefined;

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent-soft p-8 text-center">
        <p className="text-xl font-semibold text-navy-900">İlanınız alındı!</p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
        <p className="mt-1 text-sm font-medium text-navy-800">
          İlanınız admin onayından sonra yayına alınacaktır.
        </p>
        <Link href="/ilanlar" className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline">
          İlanlara git →
        </Link>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">Önce ilan kategorisini seçin:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setCategory(cat.slug)}
              className="card-surface-lg flex items-start gap-4 p-5 text-left transition-smooth hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cat.iconBg}`}>
                <CategoryIcon slug={cat.slug} />
              </span>
              <span>
                <span className="font-bold text-navy-900">{cat.label}</span>
                <span className="mt-1 block text-sm text-muted">{cat.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 relative">
      <HoneypotFields />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="imageCount" value={images.length} />

      <div className="flex items-center justify-between gap-4 rounded-xl bg-cream-100 px-4 py-3">
        <span className="text-sm font-semibold text-navy-900">{config?.label}</span>
        <button type="button" onClick={() => setCategory("")} className="text-sm text-accent hover:underline">
          Kategori değiştir
        </button>
      </div>

      {state.message && !state.ok && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}

      <FormSection title="Temel Bilgiler">
        <div>
          <label htmlFor="title" className={labelClassName}>Başlık *</label>
          <input id="title" name="title" required minLength={8} maxLength={120} className={inputClassName} />
        </div>
        <div>
          <label htmlFor="description" className={labelClassName}>Açıklama *</label>
          <textarea id="description" name="description" required minLength={20} rows={4} className={inputClassName} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isUrgent" value="1" className="rounded text-accent" />
          Acil ilan
        </label>
      </FormSection>

      {category !== "hizmet-verenler" && (
      <FormSection
        title="Konum / Rota"
        description={config?.requiresRoute ? "Çıkış ve varış noktaları" : "Konum bilgisi"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>{config?.requiresRoute ? "Nereden (şehir) *" : "Şehir *"}</label>
            <input name="cityFrom" required className={inputClassName} />
          </div>
          <div>
            <label className={labelClassName}>İlçe {category === "ev-devri" ? "*" : ""}</label>
            <input name="districtFrom" required={category === "ev-devri"} className={inputClassName} />
          </div>
          {config?.requiresRoute && (
            <>
              <div>
                <label className={labelClassName}>Nereye (şehir) *</label>
                <input name="cityTo" required className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Varış ilçesi</label>
                <input name="districtTo" className={inputClassName} />
              </div>
            </>
          )}
        </div>
      </FormSection>
      )}

      {category !== "sehir-sorusu" && category !== "hizmet-verenler" && (
        <FormSection title="Tarih / Saat">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClassName}>Tarih</label>
              <input name="availableDate" type="date" className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Başlangıç</label>
              <input name="availableTimeStart" type="time" className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Bitiş</label>
              <input name="availableTimeEnd" type="time" className={inputClassName} />
            </div>
          </div>
        </FormSection>
      )}

      <CategoryFormFields category={category} />

      <FormSection
        title="Fotoğraflar"
        description={
          listingRequiresPhotos(category)
            ? `En az ${config?.minPhotos ?? 1} fotoğraf gerekli`
            : "Opsiyonel"
        }
      >
        <ListingImageUpload
          images={images}
          onChange={setImages}
          onError={(msg) => toast(msg, "error")}
        />
      </FormSection>

      <FormSection title="İletişim">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Adınız *</label>
            <input name="contactName" required className={inputClassName} />
          </div>
          <div>
            <label className={labelClassName}>WhatsApp *</label>
            <input name="whatsapp" required inputMode="tel" placeholder="05XX XXX XX XX" className={inputClassName} />
          </div>
          {category !== "ev-devri" &&
            category !== "esya-devri" &&
            category !== "hizmet-verenler" && (
            <div className="sm:col-span-2">
              <label className={labelClassName}>Fiyat (₺)</label>
              <input name="price" type="number" min={0} className={inputClassName} />
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Güvenlik Onayı">
        <SecurityNotice message={SECURITY_MESSAGES.deposit} />
        <label className="flex items-start gap-2 text-sm text-navy-800">
          <input type="checkbox" required name="securityConfirm" value="1" className="mt-1 rounded text-accent" />
          Kapora uyarısını okudum. Ödeme yapmadan önce ilan sahibini doğrulayacağım.
        </label>
      </FormSection>

      <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto" aria-busy={pending}>
        {pending ? "Gönderiliyor..." : "İlanı Yayınla"}
      </Button>
    </form>
  );
}
