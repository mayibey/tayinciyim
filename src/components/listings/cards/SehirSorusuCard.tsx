import { ListingCardShell } from "./ListingCardShell";
import {
  ANSWER_STATUS_LABELS,
  OFFICER_GROUP_LABELS,
  QUESTION_TYPE_LABELS,
} from "@/lib/constants/field-labels";
import type { Listing } from "@/types/listing";

export function SehirSorusuCard({
  listing,
}: {
  listing: Listing & { category: "sehir-sorusu" };
}) {
  const d = listing.details;

  return (
    <ListingCardShell
      listing={listing}
      meta={
        <>
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-semibold text-navy-800">
            {d.targetCity}
            {d.targetDistrict ? `, ${d.targetDistrict}` : ""}
          </span>
          <span className="rounded-lg bg-cream-100 px-2 py-1 text-xs font-medium text-muted">
            {QUESTION_TYPE_LABELS[d.questionType]}
          </span>
          <span className="rounded-lg bg-navy-900/8 px-2 py-1 text-xs font-medium text-navy-800">
            {OFFICER_GROUP_LABELS[d.officerGroup]}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              d.answerStatus === "cevaplandi"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {ANSWER_STATUS_LABELS[d.answerStatus]}
          </span>
        </>
      }
    />
  );
}
