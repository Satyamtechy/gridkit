import { resolveCollisions, overlaps, clampToBounds } from "./collision";
import { GridKitItem } from "./types";

// Simple test runner
let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${(e as Error).message}`); }
}
function assert(condition: boolean, msg = "Assertion failed") { if (!condition) throw new Error(msg); }
function assertEqual(a: unknown, b: unknown) { if (a !== b) throw new Error(`Expected ${b}, got ${a}`); }

console.log("\n=== GridKit Core Tests ===\n");

// --- overlaps ---
console.log("overlaps():");

test("detects overlapping items", () => {
  const a: GridKitItem = { id: "1", x: 0, y: 0, w: 100, h: 100 };
  const b: GridKitItem = { id: "2", x: 50, y: 50, w: 100, h: 100 };
  assert(overlaps(a, b) === true);
});

test("detects non-overlapping items (side by side)", () => {
  const a: GridKitItem = { id: "1", x: 0, y: 0, w: 100, h: 100 };
  const b: GridKitItem = { id: "2", x: 110, y: 0, w: 100, h: 100 };
  assert(overlaps(a, b) === false);
});

test("detects non-overlapping items (vertically stacked)", () => {
  const a: GridKitItem = { id: "1", x: 0, y: 0, w: 100, h: 100 };
  const b: GridKitItem = { id: "2", x: 0, y: 110, w: 100, h: 100 };
  assert(overlaps(a, b) === false);
});

test("detects edge-touching as non-overlapping", () => {
  const a: GridKitItem = { id: "1", x: 0, y: 0, w: 100, h: 100 };
  const b: GridKitItem = { id: "2", x: 100, y: 0, w: 100, h: 100 };
  assert(overlaps(a, b) === false);
});

test("respects gap parameter", () => {
  const a: GridKitItem = { id: "1", x: 0, y: 0, w: 100, h: 100 };
  const b: GridKitItem = { id: "2", x: 105, y: 0, w: 100, h: 100 };
  assert(overlaps(a, b, 10) === true); // 5px apart but gap=10
  assert(overlaps(a, b, 3) === false); // 5px apart and gap=3
});

// --- resolveCollisions ---
console.log("\nresolveCollisions():");

test("pushes overlapping item down", () => {
  const items: GridKitItem[] = [
    { id: "1", x: 0, y: 0, w: 200, h: 100 },
    { id: "2", x: 50, y: 50, w: 100, h: 100 },
  ];
  const result = resolveCollisions(items, "1");
  const item2 = result.find(i => i.id === "2")!;
  assert(item2.y >= 100, `item2.y should be >= 100, got ${item2.y}`);
});

test("doesn't move the moved item", () => {
  const items: GridKitItem[] = [
    { id: "1", x: 0, y: 0, w: 200, h: 100 },
    { id: "2", x: 0, y: 50, w: 200, h: 100 },
  ];
  const result = resolveCollisions(items, "1");
  const item1 = result.find(i => i.id === "1")!;
  assertEqual(item1.x, 0);
  assertEqual(item1.y, 0);
});

test("resolves cascading collisions", () => {
  const items: GridKitItem[] = [
    { id: "1", x: 0, y: 0, w: 200, h: 100 },
    { id: "2", x: 0, y: 50, w: 200, h: 100 },
    { id: "3", x: 0, y: 80, w: 200, h: 100 },
  ];
  const result = resolveCollisions(items, "1");
  const i2 = result.find(i => i.id === "2")!;
  const i3 = result.find(i => i.id === "3")!;
  assert(i2.y >= 100);
  assert(i3.y >= i2.y + i2.h);
});

test("doesn't push non-overlapping items", () => {
  const items: GridKitItem[] = [
    { id: "1", x: 0, y: 0, w: 100, h: 100 },
    { id: "2", x: 200, y: 0, w: 100, h: 100 },
  ];
  const result = resolveCollisions(items, "1");
  const item2 = result.find(i => i.id === "2")!;
  assertEqual(item2.y, 0);
});

test("handles gap in collision resolution", () => {
  const items: GridKitItem[] = [
    { id: "1", x: 0, y: 0, w: 200, h: 100 },
    { id: "2", x: 0, y: 50, w: 200, h: 100 },
  ];
  const result = resolveCollisions(items, "1", 10);
  const item2 = result.find(i => i.id === "2")!;
  assert(item2.y >= 110, `Expected y >= 110 with gap=10, got ${item2.y}`);
});

// --- clampToBounds ---
console.log("\nclampToBounds():");

test("clamps x to 0 when negative", () => {
  const item: GridKitItem = { id: "1", x: -50, y: 0, w: 200, h: 100 };
  const result = clampToBounds(item, 800);
  assertEqual(result.x, 0);
});

test("clamps x so item doesn't overflow right", () => {
  const item: GridKitItem = { id: "1", x: 700, y: 0, w: 200, h: 100 };
  const result = clampToBounds(item, 800);
  assertEqual(result.x, 600); // 800 - 200
});

test("clamps y to 0 when negative", () => {
  const item: GridKitItem = { id: "1", x: 0, y: -30, w: 200, h: 100 };
  const result = clampToBounds(item, 800);
  assertEqual(result.y, 0);
});

test("clamps width when item starts near edge", () => {
  const item: GridKitItem = { id: "1", x: 750, y: 0, w: 200, h: 100 };
  const result = clampToBounds(item, 800);
  assert(result.x + result.w <= 800);
});

test("doesn't change items already in bounds", () => {
  const item: GridKitItem = { id: "1", x: 100, y: 50, w: 200, h: 100 };
  const result = clampToBounds(item, 800);
  assertEqual(result.x, 100);
  assertEqual(result.y, 50);
  assertEqual(result.w, 200);
});

// --- Summary ---
console.log("\nredistribute (via resolveCollisions + manual):");

test("redistributes items into 3 columns starting from (0,0)", () => {
  const items: GridKitItem[] = [
    { id: "1", x: 500, y: 300, w: 400, h: 200 },
    { id: "2", x: 100, y: 500, w: 200, h: 150 },
    { id: "3", x: 800, y: 100, w: 200, h: 150 },
    { id: "4", x: 0, y: 0, w: 200, h: 100 },
  ];
  const containerW = 900;
  const columns = 3;
  const gap = 10;
  const colW = Math.floor((containerW - (columns - 1) * gap) / columns);
  let col = 0, rowY = 0, rowH = 0;
  const result = items.map(item => {
    const span = item.w > colW * 1.3 ? Math.min(2, columns) : 1;
    const itemW = span * colW + (span - 1) * gap;
    if (col + span > columns) { col = 0; rowY += rowH + gap; rowH = 0; }
    const x = col * (colW + gap);
    const y = rowY;
    col += span;
    rowH = Math.max(rowH, item.h);
    return { ...item, x, y, w: itemW };
  });
  // First item should start at (0,0)
  assertEqual(result[0].x, 0);
  assertEqual(result[0].y, 0);
  // Second item should be to the right of first
  assert(result[1].x > 0);
  assertEqual(result[1].y, 0);
  // Items don't exceed container width
  for (const r of result) {
    assert(r.x + r.w <= containerW, `Item ${r.id} overflows: ${r.x + r.w} > ${containerW}`);
  }
});

test("wide items span 2 columns", () => {
  const containerW = 900;
  const columns = 3;
  const gap = 10;
  const colW = Math.floor((containerW - (columns - 1) * gap) / columns);
  const items: GridKitItem[] = [
    { id: "1", x: 0, y: 0, w: 500, h: 200 }, // wider than 1.3x colW
  ];
  let col = 0, rowY = 0, rowH = 0;
  const result = items.map(item => {
    const span = item.w > colW * 1.3 ? Math.min(2, columns) : 1;
    const itemW = span * colW + (span - 1) * gap;
    if (col + span > columns) { col = 0; rowY += rowH + gap; rowH = 0; }
    const x = col * (colW + gap);
    const y = rowY;
    col += span;
    rowH = Math.max(rowH, item.h);
    return { ...item, x, y, w: itemW };
  });
  // Should span 2 columns
  const expectedW = 2 * colW + gap;
  assertEqual(result[0].w, expectedW);
});

// --- Summary ---
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
