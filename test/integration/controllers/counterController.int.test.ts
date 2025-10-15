// test/integration/controllers/counterController.int.test.ts
import express from "express";
import request from "supertest";

import * as queueServiceModule from "../../../src/services/queueService"; // как в ticketController
import CounterController from "../../../src/controllers/counterController";

function makeApp(counterServiceMock: { getCounterById: jest.Mock }) {
  const controller = new CounterController(counterServiceMock as any);

  const app = express();
  app.use(express.json());

  app.get("/api/counters/:id", controller.getCounterById.bind(controller));
  app.post("/api/counters/:id/next", controller.getNextCustomer.bind(controller));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err?.status || 500).json({ message: err?.message || "Unexpected error" });
  });

  return app;
}

describe("CounterController (Integration) — real controller + spyOn services", () => {
  const counterServiceMock = { getCounterById: jest.fn() };

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("GET /api/counters/:id", () => {
    it("returns 404 when counter is not found", async () => {
      counterServiceMock.getCounterById.mockResolvedValueOnce(null);
      const app = makeApp(counterServiceMock);

      const res = await request(app).get("/api/counters/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Counter not found" });
      expect(counterServiceMock.getCounterById).toHaveBeenCalledWith(999);
    });

    it("returns the counter DTO when found", async () => {
      const dto = { id: 1, name: "Counter A", services: [1, 2] };
      counterServiceMock.getCounterById.mockResolvedValueOnce(dto);
      const app = makeApp(counterServiceMock);

      const res = await request(app).get("/api/counters/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(dto);
      expect(counterServiceMock.getCounterById).toHaveBeenCalledWith(1);
    });
  });

  describe("POST /api/counters/:id/next", () => {
    it("returns 404 if counter does not exist", async () => {
      const spy = jest.spyOn(queueServiceModule.queueService, "getNextTicket");

      counterServiceMock.getCounterById.mockResolvedValueOnce(null);
      const app = makeApp(counterServiceMock);

      const res = await request(app).post("/api/counters/5/next");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Counter not found" });
      expect(counterServiceMock.getCounterById).toHaveBeenCalledWith(5);
      expect(spy).not.toHaveBeenCalled();
    });

    it("propagates unexpected errors as 500", async () => {
      // падаем до вызова очереди
      counterServiceMock.getCounterById.mockRejectedValueOnce(new Error("boom"));
      const spy = jest.spyOn(queueServiceModule.queueService, "getNextTicket");

      const app = makeApp(counterServiceMock);
      const res = await request(app).post("/api/counters/1/next");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "boom" });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});