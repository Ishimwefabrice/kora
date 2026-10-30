import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(req: Request) {
  return clearSession(NextResponse.redirect(new URL("/", req.url), 303));
}
