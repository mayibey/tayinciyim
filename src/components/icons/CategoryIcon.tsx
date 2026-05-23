import type { CategorySlug } from "@/types/listing";

interface CategoryIconProps {
  slug: CategorySlug;
  className?: string;
}

export function CategoryIcon({ slug, className = "h-6 w-6" }: CategoryIconProps) {
  const props = {
    className,
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "ev-devri":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10" />
        </svg>
      );
    case "esya-devri":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        </svg>
      );
    case "nakliye-ariyorum":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8M3 17h2M19 17h2M5 17V9l4-4h6l4 4v8" />
          <circle cx="7" cy="17" r="1.5" fill="currentColor" />
          <circle cx="17" cy="17" r="1.5" fill="currentColor" />
        </svg>
      );
    case "nakliyeci-arac-ilani":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17h6M4 17h1M19 17h1M6 17V8l3-3h6l3 3v9" />
          <rect x="8" y="4" width="8" height="3" rx="1" />
        </svg>
      );
    case "sehir-sorusu":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case "hizmet-verenler":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
  }
}
