const HTML_TAG = /<[^>]*>/g;
const SCRIPTISH = /javascript:|on\w+\s*=/gi;

export function stripHtml(input: string): string {
  return input.replace(HTML_TAG, "").replace(SCRIPTISH, "").trim();
}

export function sanitizePlainText(
  input: string,
  maxLength: number,
): string {
  return stripHtml(input).slice(0, maxLength);
}

export function sanitizeListingTitle(title: string): string {
  return sanitizePlainText(title, 120);
}

export function sanitizeListingDescription(description: string): string {
  return sanitizePlainText(description, 5000);
}

export function sanitizeShortText(input: string, max = 200): string {
  return sanitizePlainText(input, max);
}
