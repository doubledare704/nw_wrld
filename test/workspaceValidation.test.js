const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  normalizeModuleSummaries,
  normalizeModuleWithMeta,
  normalizeModuleUrlResult,
} = require(path.join(
  __dirname,
  "..",
  "dist",
  "runtime",
  "shared",
  "validation",
  "workspaceValidation.js"
));

test("workspace normalizer filters and shapes module summaries", () => {
  const input = [
    null,
    { file: "A.js", id: "A", name: "A", category: "Cat", hasMetadata: true },
    { file: "B.js", id: "B", hasMetadata: false },
    { file: "", id: "C", hasMetadata: true },
    { file: "D.js", id: "", hasMetadata: true },
  ];
  const res = normalizeModuleSummaries(input);
  assert.deepEqual(res, [
    { file: "A.js", id: "A", name: "A", category: "Cat", hasMetadata: true },
    { file: "B.js", id: "B", hasMetadata: false },
  ]);
});

test("workspace normalizer accepts valid readModuleWithMeta result", () => {
  const res = normalizeModuleWithMeta({ text: "hello", mtimeMs: 123 });
  assert.deepEqual(res, { text: "hello", mtimeMs: 123 });
});

test("workspace normalizer rejects invalid readModuleWithMeta result", () => {
  assert.equal(normalizeModuleWithMeta({ text: "x", mtimeMs: "123" }), null);
});

test("workspace normalizer accepts valid getModuleUrl result", () => {
  const res = normalizeModuleUrlResult({ url: "file:///x.js?t=1", mtimeMs: 1 });
  assert.deepEqual(res, { url: "file:///x.js?t=1", mtimeMs: 1 });
});
