import { NextResponse } from "next/server";
import { canManage, getSession } from "@/lib/auth";
import { audit, deleteKit, getKit, putKit } from "@/lib/kits";
import { cleanNotes } from "@/lib/validators";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kit = await getKit(id);
  if (!kit) return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  return NextResponse.json(kit);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  const kit = await getKit(id);
  if (!kit) return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  if (!canManage(session, kit.userId, Boolean(kit.publicSeed))) {
    return NextResponse.json({ error: "You cannot edit this kit." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  kit.notes = cleanNotes(body.notes ?? kit.notes);
  const saved = await putKit(kit, kit.userId);
  await audit("update", "notes", session?.userId, kit.id);
  return NextResponse.json(saved);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  const kit = await getKit(id);
  if (!kit) return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  if (!canManage(session, kit.userId, false) || kit.publicSeed) {
    return NextResponse.json({ error: "This kit cannot be deleted." }, { status: 403 });
  }
  await deleteKit(id);
  await audit("delete", id, session?.userId, id);
  return NextResponse.json({ ok: true });
}
