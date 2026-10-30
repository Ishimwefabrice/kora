import { NextResponse } from "next/server";
import { runFleet, tokenFactoryReady } from "@/lib/nebius";
import { kimironkoSeed } from "@/lib/seed";
import { putKit } from "@/lib/store";
import type { ExtractRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ExtractRequest;
    if (body.seed === "kimironko") {
      const kit = await putKit(kimironkoSeed());
      return NextResponse.json(kit);
    }
    if (!body.imageDataUrl && !body.notes) {
      return NextResponse.json(
        { error: "Photograph the page, type the lines, or open the Kimironko seed." },
        { status: 400 }
      );
    }
    if (!tokenFactoryReady()) {
      return NextResponse.json(
        {
          error:
            "Live reading needs NEBIUS_API_KEY. Open the Kimironko seed for the finished public kit, or add a Token Factory key."
        },
        { status: 503 }
      );
    }
    const kit = await putKit(await runFleet(body));
    return NextResponse.json(kit);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Token Factory call failed" },
      { status: 500 }
    );
  }
}
