"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState } from "react";
import { MAX_LISTING_IMAGES } from "@/lib/storage/types";
import { validateImageBatch } from "@/lib/storage/upload";

export interface LocalPreviewImage {
  id: string;
  file: File;
  previewUrl: string;
}

interface ListingImageUploadProps {
  images: LocalPreviewImage[];
  onChange: (images: LocalPreviewImage[]) => void;
  onError?: (message: string) => void;
}

export function ListingImageUpload({
  images,
  onChange,
  onError,
}: ListingImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const err = validateImageBatch(list, images.length);
      if (err) {
        onError?.(err);
        return;
      }

      const newImages: LocalPreviewImage[] = list.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      onChange([...images, ...newImages]);
    },
    [images, onChange, onError],
  );

  const removeImage = (id: string) => {
    const removed = images.find((i) => i.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    onChange(images.filter((i) => i.id !== id));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy-800">
        Görseller
        <span className="ml-1 font-normal text-muted">(en fazla {MAX_LISTING_IMAGES})</span>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-smooth ${
          dragOver
            ? "border-accent bg-accent-soft/50"
            : "border-navy-900/15 bg-cream-50/80 hover:border-accent/50 hover:bg-cream-100"
        }`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Görsel yükle"
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <svg className="mb-3 h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-semibold text-navy-900">
          Sürükleyip bırakın veya tıklayın
        </p>
        <p className="mt-1 text-xs text-muted">JPEG, PNG, WebP · Maks. 5 MB · {images.length}/{MAX_LISTING_IMAGES}</p>
      </div>

      {images.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img, i) => (
            <li key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-cream-100">
              <Image
                src={img.previewUrl}
                alt={`Önizleme ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-navy-900/80 text-white opacity-0 transition-smooth group-hover:opacity-100 focus:opacity-100"
                aria-label={`Görsel ${i + 1} kaldır`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
