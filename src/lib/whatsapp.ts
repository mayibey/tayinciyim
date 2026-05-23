/** Türkiye WhatsApp wa.me linki oluşturur */
export function buildWhatsAppUrl(phone: string, message?: string): string | null {
  const digits = phone.replace(/\D/g, "");
  let normalized = digits;

  if (normalized.startsWith("0")) {
    normalized = `90${normalized.slice(1)}`;
  } else if (!normalized.startsWith("90")) {
    normalized = `90${normalized}`;
  }

  if (normalized.length < 12 || normalized.length > 13) {
    return null;
  }

  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function extractWhatsAppFromContact(contact?: string): string | null {
  if (!contact) return null;
  const digits = contact.replace(/\D/g, "");
  if (digits.length >= 10) return contact;
  return null;
}
