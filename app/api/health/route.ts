import { NextResponse } from "next/server";
import { MODELS, tokenFactoryReady } from "@/lib/nebius";
import type { Health } from "@/lib/types";

export async function GET() {
  const body: Health = {
    ok: true,
    product: "kora",
    tokenFactory: tokenFactoryReady(),
    tavily: Boolean(process.env.TAVILY_API_KEY),
    visionModel: MODELS.VISION,
    copyModel: MODELS.COPY,
    endpoint: MODELS.ENDPOINT
  };
  return NextResponse.json(body);
}
