import assert from "node:assert/strict";
import test from "node:test";
import { MIN_CONFIDENCE, formatRwf, parseAmount, provenTotal, sealLine } from "../lib/gate";

test("parseAmount reads RWF figures and rejects junk", () => {
  assert.equal(parseAmount("inyanya 4 500"), 4500);
  assert.equal(parseAmount("amavuta ???"), null);
});

test("sealLine blanks low confidence and missing amounts", () => {
  const blank = sealLine({
    id: "1",
    raw: "oil ???",
    item: "Oil",
    itemRw: "Amavuta",
    quantity: "1 L",
    amountRwf: null,
    confidence: 0.4,
    tavilyNote: null
  });
  assert.equal(blank.status, "blank");
  assert.equal(blank.amountRwf, null);

  const weak = sealLine({
    id: "2",
    raw: "soap 800",
    item: "Soap",
    itemRw: "Isabune",
    quantity: "1",
    amountRwf: 800,
    confidence: MIN_CONFIDENCE - 0.01,
    tavilyNote: null
  });
  assert.equal(weak.status, "blank");

  const proven = sealLine({
    id: "3",
    raw: "soap 800",
    item: "Soap",
    itemRw: "Isabune",
    quantity: "1",
    amountRwf: 800,
    confidence: 0.9,
    tavilyNote: null
  });
  assert.equal(proven.status, "proven");
  assert.equal(formatRwf(provenTotal([proven, blank])), "800 RWF");
});
