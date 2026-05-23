export const SITE_NAME = "tayinciyim.net";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? "https://tayinciyim.net"
    : "http://localhost:3000");
export const SITE_DESCRIPTION =
  "Kamu tayini ve yer değiştirme sürecinde ev devri, eşya devri, ortak nakliye ve şehir soruları için güvenilir ilan platformu.";

export const SECURITY_MESSAGES = {
  deposit: `Kapora veya ön ödeme göndermeden önce ilan sahibini mutlaka doğrulayın. ${SITE_NAME} ödeme aracılığı değildir.`,
  detail: `Profil puanı ve yorumlar bilgilendirme amaçlıdır. Ödeme veya kapora göndermeden önce ilan sahibini mutlaka doğrulayın. ${SITE_NAME} ödeme aracılığı yapmaz.`,
} as const;
