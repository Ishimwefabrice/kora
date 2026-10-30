import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { audit, putKit } from "@/lib/kits";
import { runFleet, tokenFactoryReady } from "@/lib/nebius";
import { rateLimit } from "@/lib/rate-limit";
import { kimironkoSeed } from "@/lib/seed";
import type { ExtractRequest } from "@/lib/types";
import { assertImage, cleanNotes } from "@/lib/validators";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    if (!rateLimit(`extract:${ip}`, 20)) {
      return NextResponse.json({ error: "Too many reads. Wait a minute." }, { status: 429 });
    }
    const body = (await req.json()) as ExtractRequest;
    const session = await getSession();
    if (body.seed === "kimironko") {
      const kit = await putKit(kimironkoSeed(), null);
      return NextResponse.json(kit);
    }
    if (!session) {
      return NextResponse.json({ error: "Log in to read your own notebook page." }, { status: 401 });
    }
    const notes = cleanNotes(body.notes);
    const imageDataUrl = body.imageDataUrl ? assertImage(body.imageDataUrl) : undefined;
    if (body.imageDataUrl && !imageDataUrl) {
      return NextResponse.json({ error: "Use a smaller image (PNG, JPEG, or WebP under about 4 MB)." }, { status: 400 });
    }
    if (!imageDataUrl && !notes) {
      return NextResponse.json(
        { error: "Photograph the page, type the lines, or open the Kimironko seed." },
        { status: 400 }
      );
    }
    if (!tokenFactoryReady()) {
      return NextResponse.json(
        {
          error:
            "Live reading needs NEBIUS_API_KEY on the server. Open the Kimironko seed, or add a Token Factory key in .env.local."
        },
        { status: 503 }
      );
    }
    const kit = await putKit(await runFleet({ notes, imageDataUrl: imageDataUrl ?? undefined }), session.userId);
    await audit("extract", kit.shopName, session.userId, kit.id);
    return NextResponse.json(kit);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Token Factory call failed" },
      { status: 500 }
    );
  }
}
