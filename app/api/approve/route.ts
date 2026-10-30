import { NextResponse } from "next/server";
import { canManage, getSession } from "@/lib/auth";
import { audit, getKit, putKit } from "@/lib/kits";
import { draftInvoice } from "@/lib/paypal";

export async function POST(req: Request) {
  const session = await getSession();
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing kit id" }, { status: 400 });
  const kit = await getKit(id);
  if (!kit) return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  if (!canManage(session, kit.userId, Boolean(kit.publicSeed))) {
    return NextResponse.json({ error: "Log in as the owner to record YES." }, { status: 403 });
  }
  kit.approved = true;
  kit.approvedAt = new Date().toISOString();
  kit.paypal = await draftInvoice(kit);
  const saved = await putKit(kit, kit.userId);
  await audit("approve", "YES recorded, PayPal draft only", session?.userId, kit.id);
  return NextResponse.json(saved);
}
