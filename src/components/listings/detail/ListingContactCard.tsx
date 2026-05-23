"use client";

import Link from "next/link";
import { useState } from "react";
import { revealListingContactAction } from "@/app/ilanlar/[id]/contact/actions";
import { FORM_STARTED_FIELD, HONEYPOT_FIELD } from "@/lib/security/honeypot";
import { AuthorAvatar } from "@/components/listings/AuthorAvatar";
import { SecurityNotice } from "@/components/listings/SecurityNotice";
import { UserRatingSummary } from "@/components/users/UserRatingSummary";
import { UserTrustBadge } from "@/components/users/UserTrustBadge";
import { UserVerificationBadges } from "@/components/users/UserVerificationBadges";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/modal/Modal";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { USER_TYPE_LABELS } from "@/lib/constants/user-labels";
import { reportListingAction } from "@/app/ilanlar/actions";
import { SECURITY_MESSAGES } from "@/lib/constants/site";
import { maskContactName } from "@/lib/privacy/pii";
import type { Listing } from "@/types/listing";
import type { ListingAuthorSnapshot } from "@/types/user-profile";

interface ListingContactCardProps {
  listing: Listing;
  author: ListingAuthorSnapshot;
}

export function ListingContactCard({ listing, author }: ListingContactCardProps) {
  const { toast } = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportStartedAt] = useState(() => String(Date.now()));
  const [contactLoading, setContactLoading] = useState(false);

  const displayContactName = maskContactName(listing.contactName);

  const handleWhatsAppReveal = async () => {
    setContactLoading(true);
    try {
      const result = await revealListingContactAction(listing.id);
      if (!result.ok) {
        toast(result.message, "error");
        return;
      }
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    } finally {
      setContactLoading(false);
    }
  };

  const handleReport = async () => {
    setReportOpen(false);
    const securityFd = new FormData();
    securityFd.set(HONEYPOT_FIELD, "");
    securityFd.set(FORM_STARTED_FIELD, reportStartedAt);
    const result = await reportListingAction(
      listing.id,
      "diger",
      "Kullanıcı ilan detayından şikayet etti.",
      undefined,
      undefined,
      securityFd,
    );
    toast(result.message, result.ok ? "success" : "error");
  };

  return (
    <>
      <aside className="card-surface-lg sticky top-24 space-y-5 p-5 sm:p-6 lg:top-28">
        <div className="border-b border-[var(--border)] pb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            İlan sahibi
          </p>
          <div className="flex items-start gap-3">
            <AuthorAvatar
              name={author.displayName}
              imageUrl={author.avatarUrl}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy-900">{displayContactName}</p>
              <p className="text-xs font-medium text-muted">
                {USER_TYPE_LABELS[author.userType]}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <UserRatingSummary
                  average={author.ratingAverage}
                  count={author.ratingCount}
                />
                <UserTrustBadge score={author.trustScore} />
              </div>
              <p className="mt-2 text-xs text-muted">
                {author.completedTransactionCount} tamamlanan işlem
              </p>
              <div className="mt-2">
                <UserVerificationBadges badges={author.badges} max={3} size="sm" />
              </div>
            </div>
          </div>
          <Link
            href={`/profil/${author.userId}`}
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-navy-900/10 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-smooth hover:border-accent hover:text-accent"
          >
            Profili görüntüle
          </Link>
        </div>

        {listing.price != null && listing.price > 0 && (
          <div className="rounded-2xl bg-cream-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Fiyat</p>
            <p className="text-2xl font-bold text-navy-900">
              {listing.price.toLocaleString("tr-TR")} ₺
            </p>
          </div>
        )}

        <Button
          type="button"
          disabled={contactLoading}
          onClick={handleWhatsAppReveal}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-soft hover:brightness-105"
        >
          <WhatsAppIcon />
          {contactLoading ? "Hazırlanıyor..." : "WhatsApp ile iletişim"}
        </Button>

        <SecurityNotice message={SECURITY_MESSAGES.detail} />

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setReportOpen(true)}
        >
          Şikayet et
        </Button>
      </aside>

      <ConfirmDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onConfirm={handleReport}
        title="İlanı şikayet et"
        description="Bu ilanı uygunsuz içerik, dolandırıcılık şüphesi veya yanıltıcı bilgi nedeniyle bildirmek istiyor musunuz? Ekibimiz inceleyecektir."
        confirmLabel="Şikayeti gönder"
        variant="danger"
      />
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
