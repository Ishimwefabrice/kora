import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { kimironkoSeed } from "./seed";
import type { Kit } from "./types";

const DATA = path.join(process.cwd(), "data", "kits.json");

type Store = Record<string, Kit>;

async function load(): Promise<Store> {
  try {
    const raw = await readFile(DATA, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    const seed = kimironkoSeed();
    const initial: Store = { [seed.id]: seed };
    await save(initial);
    return initial;
  }
}

async function save(store: Store): Promise<void> {
  await mkdir(path.dirname(DATA), { recursive: true });
  await writeFile(DATA, JSON.stringify(store, null, 2), "utf8");
}

export async function getKit(id: string): Promise<Kit | null> {
  const store = await load();
  return store[id] ?? null;
}

export async function putKit(kit: Kit): Promise<Kit> {
  const store = await load();
  store[kit.id] = kit;
  await save(store);
  return kit;
}

export async function listKits(): Promise<Kit[]> {
  const store = await load();
  return Object.values(store).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
