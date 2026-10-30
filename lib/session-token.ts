import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "kora_session";

export type Session = {
  userId: string;
  email: string;
  name: string;
  role: "owner" | "admin";
};

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be at least 32 characters in production.");
    }
    return "kora-local-dev-secret-change-me-32ch";
  }
  return value;
}

function key() {
  return new TextEncoder().encode(secret());
}

export async function signSession(session: Session): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function parseSession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    if (!payload.userId || !payload.email || !payload.role) return null;
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name ?? ""),
      role: payload.role === "admin" ? "admin" : "owner"
    };
  } catch {
    return null;
  }
}
