"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAction } from "@/lib/admin/admin-auth";
import { ListingRepositoryError } from "@/lib/data/repository-error";
import { updateListingStatus } from "@/lib/data/listings";
import type { ListingStatus } from "@/types/listing";

export async function updateListingStatusAction(
  id: string,
  status: ListingStatus,
): Promise<{ ok: boolean; message?: string }> {
  await assertAdminAction();
  try {
    await updateListingStatus(id, status);
    revalidatePath("/admin");
    revalidatePath("/ilanlar");
    revalidatePath(`/ilanlar/${id}`);
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof ListingRepositoryError
        ? err.message
        : "Durum güncellenemedi.";
    return { ok: false, message };
  }
}
