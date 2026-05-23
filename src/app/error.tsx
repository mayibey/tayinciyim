"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Bir sorun oluştu</p>
      <h1 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">
        Sayfa yüklenirken hata oluştu
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-navy-700/80">
        Geçici bir teknik sorun olabilir. Sayfayı yenilemeyi deneyin; sorun devam ederse bir süre
        sonra tekrar gelin.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Tekrar dene
        </Button>
        <ButtonLink variant="secondary" href="/">
          Ana sayfa
        </ButtonLink>
      </div>
    </div>
  );
}
