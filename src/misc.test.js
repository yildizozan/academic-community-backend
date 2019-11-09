const misc = require("./misc");

test("check nil uuid", () => {
  expect(misc.isValidUUID("00000000-0000-0000-0000-000000000000")).toBeTruthy();
});

test("check uuid", () => {
  expect(misc.isValidUUID("14427164-1d33-441c-8076-192849cbcdd9")).toBeTruthy();
});

test("check uuid", () => {
  expect(misc.isValidUUID("14427164-1d3o-441c-8076-192849cbcdd9")).toBeFalsy();
});
