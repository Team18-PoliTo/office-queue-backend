import express from "express";
import request from "supertest";
import { postTicket } from "../../../src/controllers/ticketController";
import * as ticketServiceModule from "../../../src/services/ticketService";

describe("TicketController (Integration) - using real controller", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post("/api/tickets", postTicket);

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status || 500).json({ message: err.message || "Internal server error" });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 if serviceId is missing", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/serviceId is required/i);
  });

  it("should return 201 when ticket is successfully created", async () => {
    jest.spyOn(ticketServiceModule.ticketService, "createForService").mockResolvedValue({
      id: 1,
      serviceName: "A",
      timestamp: new Date().toISOString(),
      waitEstimateMin: null,
    });

    const res = await request(app).post("/api/tickets").send({ serviceId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 1);
    expect(ticketServiceModule.ticketService.createForService).toHaveBeenCalledWith(1);
  });

  it("should return 404 if service not found", async () => {
    jest.spyOn(ticketServiceModule.ticketService, "createForService").mockRejectedValue({
      status: 404,
      message: "Service not found",
    });

    const res = await request(app).post("/api/tickets").send({ serviceId: 99 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Service not found");
  });

  it("should return 500 on unexpected errors", async () => {
    jest.spyOn(ticketServiceModule.ticketService, "createForService").mockRejectedValue(
      new Error("Unexpected error")
    );

    const res = await request(app).post("/api/tickets").send({ serviceId: 1 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Unexpected error");
  });
});
