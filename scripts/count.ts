import { prisma } from "../lib/db";

async function main() {
  console.log("users", await prisma.user.count());
  console.log("kits", await prisma.kit.count());
  await prisma.$disconnect();
}

main();
