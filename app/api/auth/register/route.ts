import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { attachSession, signSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { cleanEmail, cleanName, cleanPassword } from "@/lib/validators";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`register:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many accounts from this network. Wait and try again." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const email = cleanEmail(body.email);
  const name = cleanName(body.name);
  const password = cleanPassword(body.password);
  if (!email || !name || !password) {
    return NextResponse.json(
      { error: "Use a real email, a name of at least 2 characters, and a password of at least 10 characters." },
      { status: 400 }
    );
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "That email already has an account." }, { status: 409 });
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: email === process.env.ADMIN_EMAIL ? "admin" : "owner"
    }
  });
  const token = await signSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role === "admin" ? "admin" : "owner"
  });
  return attachSession(NextResponse.json({ ok: true, userId: user.id }), token);
}
