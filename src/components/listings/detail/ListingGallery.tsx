"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { ListingImage } from "@/types/listing";

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  const active = images[activeIndex] ?? images[0];

  const scrollThumbIntoView = useCallback((index: number) => {
    const container = thumbRef.current;
    if (!container) return;
    const thumb = container.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const selectImage = (index: number) => {
    setActiveIndex(index);
    scrollThumbIntoView(index);
  };

  if (!active) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-cream-200 text-muted sm:aspect-[16/10]">
        Görsel yok
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-200 shadow-card sm:aspect-[16/10] sm:rounded-3xl">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt ?? title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover transition-opacity duration-300"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => selectImage((activeIndex - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-navy-900 shadow-soft transition-smooth hover:bg-card max-sm:hidden"
              aria-label="Önceki görsel"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => selectImage((activeIndex + 1) % images.length)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-navy-900 shadow-soft transition-smooth hover:bg-card max-sm:hidden"
              aria-label="Sonraki görsel"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-navy-900/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          ref={thumbRef}
          className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch]"
          role="tablist"
          aria-label="Görsel küçük resimleri"
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Görsel ${i + 1}`}
              onClick={() => selectImage(i)}
              className={`relative h-16 w-24 shrink-0 snap-center overflow-hidden rounded-xl border-2 transition-smooth sm:h-20 sm:w-28 ${
                i === activeIndex
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
