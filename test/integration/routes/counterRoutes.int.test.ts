import express from "express";
import request from "supertest";
import CounterController from "../../../src/controllers/counterController";
import CounterService from "../../../src/services/counterService";
import { requireOfficer, validateUserType } from "../../../src/middleware/authMiddleware";

describe("Counter Routes (Integration)", () => {
  let app: express.Express;
  const mockCounterRepository = {
    findById: jest.fn(),
  };

  beforeAll(() => {
    const counterService = new CounterService(mockCounterRepository as any);
    const counterController = new CounterController(counterService);

    app = express();
    app.use(express.json());

    app.get(
      "/api/counters/:id",
      validateUserType,
      requireOfficer,
      counterController.getCounterById.bind(counterController)
    );

    app.get(
      "/api/counters/:id/next",
      validateUserType,
      requireOfficer,
      counterController.getNextCustomer.bind(counterController)
    );

    // error handler
    app.use((err: any, _req: any, res: any, _next: any) => {
      res.status(err?.status || 500).json({ message: err?.message || "Unexpected error" });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/counters/:id → should return 404 if counter not found", async () => {
    mockCounterRepository.findById.mockResolvedValueOnce(null);

    const res = await request(app)
      .get("/api/counters/999")
      .set("user-type", "officer");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Counter not found" });
    expect(mockCounterRepository.findById).toHaveBeenCalledWith(999);
  });

  it("GET /api/counters/:id → should return 200 with DTO", async () => {
    mockCounterRepository.findById.mockResolvedValueOnce({
      id: 1,
      name: "Counter A",
      avg_process_time: 12,
      services: [],
    });

    const res = await request(app)
      .get("/api/counters/1")
      .set("user-type", "officer");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name", "Counter A");
  });

  it("GET /api/counters/:id/next → should return 404 if counter not found", async () => {
    mockCounterRepository.findById.mockResolvedValueOnce(null);

    const res = await request(app)
      .get("/api/counters/5/next")
      .set("user-type", "officer");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Counter not found" });
    expect(mockCounterRepository.findById).toHaveBeenCalledWith(5);
  });
});
