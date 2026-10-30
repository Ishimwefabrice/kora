import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MODELS, tokenFactoryReady } from "@/lib/nebius";
import { paypalReady } from "@/lib/paypal";
import type { Health } from "@/lib/types";

export async function GET() {
  let database = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = true;
  } catch {
    database = false;
  }
  const body: Health = {
    ok: true,
    product: "kora",
    database,
    tokenFactory: tokenFactoryReady(),
    tavily: Boolean(process.env.TAVILY_API_KEY),
    paypal: paypalReady(),
    visionModel: MODELS.VISION,
    copyModel: MODELS.COPY,
    endpoint: MODELS.ENDPOINT
  };
  return NextResponse.json(body, { status: database ? 200 : 503 });
}
