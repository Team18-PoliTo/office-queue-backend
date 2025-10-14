import { api } from "../../setup";

describe("Counter Routes (Integration)", () => {
  it("should return 404 since no counter routes are implemented", async () => {
    const res = await api.get("/api/counters");
    expect(res.status).toBe(404);
  });
});
