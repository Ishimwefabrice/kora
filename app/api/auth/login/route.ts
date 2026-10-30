import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { attachSession, signSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { cleanEmail } from "@/lib/validators";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`login:${ip}`, 8)) {
    return NextResponse.json({ error: "Too many login attempts. Wait a minute." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const email = cleanEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";
  const fail = NextResponse.json({ error: "Email or password is wrong." }, { status: 401 });
  if (!email || password.length < 1) return fail;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return fail;
  const token = await signSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role === "admin" ? "admin" : "owner"
  });
  return attachSession(NextResponse.json({ ok: true }), token);
}
