import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";

vi.mock("../shared/db/orm.js", () => ({
  orm: {
    em: {},
  },
}));

describe("GET /api/health", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "test";
  });

  it("returns ok status", async () => {
    const { app } = await import("../server.js");
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
