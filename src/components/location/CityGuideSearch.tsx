"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function CityGuideSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/sehir-rehberi${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Şehir ara… (örn. Siirt, Ankara)"
        className="flex-1 rounded-xl border border-navy-900/10 bg-card px-4 py-3 text-sm text-navy-900 transition-smooth focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
        aria-label="Şehir ara"
      />
      <button
        type="submit"
        className="rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition-smooth hover:bg-navy-800"
      >
        Ara
      </button>
    </form>
  );
}
