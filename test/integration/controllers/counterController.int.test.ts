import { api } from "../../setup";

describe("CounterController (Integration)", () => {
  it("should return 404 since no routes are defined yet", async () => {
    const res = await api.get("/counters");
    expect([404, 501]).toContain(res.status);
  });
});
