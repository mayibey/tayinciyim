"use client";

import { useState } from "react";
import {
  CAPTCHA_TOKEN_FIELD,
  FORM_STARTED_FIELD,
  HONEYPOT_FIELD,
} from "@/lib/security/honeypot";

/** Görünmez bot koruması + form süresi — tüm formlara ekleyin */
export function HoneypotFields() {
  const [formStartedAt] = useState(() => String(Date.now()));

  return (
    <>
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <input type="hidden" name={FORM_STARTED_FIELD} value={formStartedAt} readOnly />
      <input type="hidden" name={CAPTCHA_TOKEN_FIELD} value="" readOnly />
    </>
  );
}
