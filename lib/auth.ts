import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseSession, SESSION_COOKIE, signSession, type Session } from "./session-token";

export { parseSession, SESSION_COOKIE, signSession, type Session };

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return parseSession(jar.get(SESSION_COOKIE)?.value);
}

export async function sessionFromRequest(req: NextRequest | Request): Promise<Session | null> {
  const header = req.headers.get("cookie") ?? "";
  const match = header
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${SESSION_COOKIE}=`));
  const token = match?.slice(SESSION_COOKIE.length + 1);
  return parseSession(token);
}

export function attachSession(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}

export function clearSession(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

export function canManage(session: Session | null, userId: string | null, publicSeed: boolean): boolean {
  if (publicSeed && !userId) return Boolean(session);
  if (!session) return false;
  if (session.role === "admin") return true;
  return Boolean(userId && session.userId === userId);
}
