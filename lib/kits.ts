import { prisma } from "./db";
import { kimironkoSeed } from "./seed";
import type { Kit, LedgerLine, ObservatoryCall } from "./types";

type KitRow = Awaited<ReturnType<typeof prisma.kit.findFirst>>;

export function rowToKit(row: NonNullable<KitRow>): Kit {
  return {
    id: row.id,
    userId: row.userId,
    publicSeed: row.publicSeed,
    createdAt: row.createdAt.toISOString(),
    shopName: row.shopName,
    shopNameRw: row.shopNameRw,
    place: row.place,
    source: row.source === "live" ? "live" : "seed",
    notes: row.notes,
    lines: JSON.parse(row.lines) as LedgerLine[],
    whatsappRw: row.whatsappRw,
    whatsappEn: row.whatsappEn,
    observatory: JSON.parse(row.observatory) as ObservatoryCall[],
    approved: row.approved,
    approvedAt: row.approvedAt ? row.approvedAt.toISOString() : null,
    paypal: row.paypal ? JSON.parse(row.paypal) : null
  };
}

export function kitToRow(kit: Kit, userId: string | null) {
  return {
    id: kit.id,
    userId,
    createdAt: new Date(kit.createdAt),
    shopName: kit.shopName,
    shopNameRw: kit.shopNameRw,
    place: kit.place,
    source: kit.source,
    notes: kit.notes,
    lines: JSON.stringify(kit.lines),
    whatsappRw: kit.whatsappRw,
    whatsappEn: kit.whatsappEn,
    observatory: JSON.stringify(kit.observatory),
    approved: kit.approved,
    approvedAt: kit.approvedAt ? new Date(kit.approvedAt) : null,
    paypal: kit.paypal ? JSON.stringify(kit.paypal) : null,
    publicSeed: kit.publicSeed ?? kit.id === "kimironko-mama-uwase"
  };
}

export async function ensureSeedKit(): Promise<Kit> {
  const existing = await prisma.kit.findUnique({ where: { id: "kimironko-mama-uwase" } });
  if (existing) return rowToKit(existing);
  const seed = kimironkoSeed();
  const row = await prisma.kit.create({ data: kitToRow(seed, null) });
  return rowToKit(row);
}

export async function getKit(id: string): Promise<Kit | null> {
  if (id === "kimironko-mama-uwase") return ensureSeedKit();
  const row = await prisma.kit.findUnique({ where: { id } });
  return row ? rowToKit(row) : null;
}

export async function putKit(kit: Kit, userId: string | null): Promise<Kit> {
  const data = kitToRow(kit, userId);
  const row = await prisma.kit.upsert({
    where: { id: kit.id },
    create: data,
    update: data
  });
  return rowToKit(row);
}

export async function listKits(opts: { userId?: string; q?: string; role?: string }): Promise<Kit[]> {
  await ensureSeedKit();
  const q = opts.q?.trim();
  const rows = await prisma.kit.findMany({
    where: {
      AND: [
        opts.role === "admin" || !opts.userId
          ? {}
          : { OR: [{ userId: opts.userId }, { publicSeed: true }] },
        q
          ? {
              OR: [
                { shopName: { contains: q } },
                { shopNameRw: { contains: q } },
                { place: { contains: q } }
              ]
            }
          : {}
      ]
    },
    orderBy: { createdAt: "desc" }
  });
  return rows.map(rowToKit);
}

export async function deleteKit(id: string): Promise<void> {
  if (id === "kimironko-mama-uwase") throw new Error("The public seed kit cannot be deleted.");
  await prisma.kit.delete({ where: { id } });
}

export async function audit(action: string, detail: string, userId?: string | null, kitId?: string | null) {
  await prisma.auditEvent.create({
    data: { action, detail: detail.slice(0, 500), userId: userId ?? null, kitId: kitId ?? null }
  });
}
