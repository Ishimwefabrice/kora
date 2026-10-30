import { NextResponse } from "next/server";
import { getKit, putKit } from "@/lib/store";

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing kit id" }, { status: 400 });
  const kit = await getKit(id);
  if (!kit) return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  kit.approved = true;
  kit.approvedAt = new Date().toISOString();
  await putKit(kit);
  return NextResponse.json(kit);
}
