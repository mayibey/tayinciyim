"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal/Modal";
import { SesliOkuReader } from "@/components/reader/SesliOkuReader";

interface SesliOkuButtonProps {
  className?: string;
}

export function SesliOkuButton({ className = "" }: SesliOkuButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Sesli Oku"
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-navy-900/10 px-3 text-sm font-medium text-navy-900 transition-smooth hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${className}`}
      >
        <span aria-hidden>🔊</span>
        <span className="hidden sm:inline">Sesli Oku</span>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="🔊 Sesli Oku"
        size="lg"
      >
        <SesliOkuReader />
      </Modal>
    </>
  );
}
