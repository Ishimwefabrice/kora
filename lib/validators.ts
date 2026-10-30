const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 120) return null;
  return email;
}

export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 80) return null;
  return name;
}

export function cleanPassword(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (raw.length < 10 || raw.length > 72) return null;
  return raw;
}

export function cleanNotes(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, 2000);
}

export function assertImage(dataUrl: unknown): string | null {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) return null;
  if (dataUrl.length > 6_000_000) return null;
  return dataUrl;
}
