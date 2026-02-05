import { describe, it, expect } from "vitest";
import { parseCorsOrigins, isAllowedCorsOrigin } from "../configUtils.js";

describe("parseCorsOrigins", () => {
  it("uses default when env is undefined", () => {
    const result = parseCorsOrigins(undefined, "http://localhost:8080");
    expect(result).toEqual(["http://localhost:8080"]);
  });

  it("splits and trims comma-separated origins", () => {
    const result = parseCorsOrigins(
      " https://a.com ,http://b.com,  ,https://c.com ",
      "http://localhost:8080",
    );
    expect(result).toEqual(["https://a.com", "http://b.com", "https://c.com"]);
  });

  it("returns empty list for empty env", () => {
    const result = parseCorsOrigins("", "http://localhost:8080");
    expect(result).toEqual([]);
  });
});

describe("isAllowedCorsOrigin", () => {
  it("allows requests without origin", () => {
    const result = isAllowedCorsOrigin(undefined, ["http://localhost:8080"]);
    expect(result).toBe(true);
  });

  it("allows origin present in list", () => {
    const result = isAllowedCorsOrigin("https://app.com", ["https://app.com"]);
    expect(result).toBe(true);
  });

  it("allows Google origin prefix", () => {
    const result = isAllowedCorsOrigin("https://accounts.google.com", [
      "https://app.com",
    ]);
    expect(result).toBe(true);
  });
});
