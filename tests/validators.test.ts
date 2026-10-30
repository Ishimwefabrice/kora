import assert from "node:assert/strict";
import test from "node:test";
import { cleanEmail, cleanName, cleanNotes, cleanPassword } from "../lib/validators";

test("validators reject weak accounts and oversized notes", () => {
  assert.equal(cleanEmail("Owner@Kora.local"), "owner@kora.local");
  assert.equal(cleanEmail("not-an-email"), null);
  assert.equal(cleanName("  Mama   Uwase "), "Mama Uwase");
  assert.equal(cleanPassword("short"), null);
  assert.equal(cleanPassword("KoraStall!2026")?.length, 14);
  assert.equal(cleanNotes("x".repeat(3000)).length, 2000);
});
