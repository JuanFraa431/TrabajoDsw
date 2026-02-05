export function parseCorsOrigins(
  envValue: string | undefined,
  defaultOrigin: string,
): string[] {
  const raw = envValue ?? defaultOrigin;
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isAllowedCorsOrigin(
  origin: string | undefined,
  allowedOrigins: string[],
): boolean {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.startsWith("https://accounts.google.com")) return true;
  return false;
}
