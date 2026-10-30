import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { kimironkoSeed } from "../lib/seed";
import { kitToRow } from "../lib/kits";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("KoraStall!2026", 12);
  await prisma.user.upsert({
    where: { email: "owner@kora.local" },
    update: {},
    create: {
      email: "owner@kora.local",
      name: "Demo owner",
      passwordHash,
      role: "owner"
    }
  });
  const seed = kimironkoSeed();
  await prisma.kit.upsert({
    where: { id: seed.id },
    update: {},
    create: kitToRow(seed, null)
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
