import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?.replace(/^https?:\/\//, "")
  .split("/")[0];

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
  { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
];

if (supabaseHost) {
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseHost,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
