import Image from "next/image";

interface AuthorAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function AuthorAvatar({
  name,
  imageUrl,
  size = "md",
  className = "",
}: AuthorAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = sizeMap[size];

  if (imageUrl) {
    return (
      <span
        className={`relative block shrink-0 overflow-hidden rounded-full ring-2 ring-card ${sizeClass} ${className}`}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="48px"
        />
      </span>
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-white ring-2 ring-card ${sizeClass} ${className}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
