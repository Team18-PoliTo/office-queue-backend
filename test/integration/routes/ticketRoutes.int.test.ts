import express from "express";
import request from "supertest";
import { TicketDTO } from "../../../src/models/dto/TicketDTO";

describe("TicketController (Integration)", () => {
  let app: express.Express;
  let ticketServiceMock: any;

  beforeAll(() => {
    ticketServiceMock = {
      createForService: jest.fn(),
    };

    const postTicketMock = async (req: any, res: any, next: any) => {
      try {
        const { serviceId } = req.body;
        if (!serviceId || Number.isNaN(Number(serviceId))) {
          return res.status(400).json({ message: "serviceId is required and must be a number." });
        }

        const result: TicketDTO = await ticketServiceMock.createForService(Number(serviceId));
        return res.status(201).json(result);
      } catch (e: any) {
        if (e?.status === 404) return res.status(404).json({ message: e.message });
        next(e);
      }
    };

    app = express();
    app.use(express.json());
    app.post("/api/tickets", postTicketMock);
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status || 500).json({ message: err.message || "Internal server error" });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if serviceId is missing", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/serviceId is required/i);
  });

  it("should return 201 when ticket is successfully created", async () => {
    ticketServiceMock.createForService.mockResolvedValue({
      id: 1,
      serviceName: "A",
      timestamp: new Date().toISOString(),
      waitEstimateMin: null,
    });

    const res = await request(app).post("/api/tickets").send({ serviceId: 1 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 1);
    expect(ticketServiceMock.createForService).toHaveBeenCalledWith(1);
  });

  it("should return 404 if service not found", async () => {
    ticketServiceMock.createForService.mockRejectedValue({
      status: 404,
      message: "Service not found",
    });

    const res = await request(app).post("/api/tickets").send({ serviceId: 99 });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Service not found");
  });

  it("should return 500 on unexpected errors", async () => {
    ticketServiceMock.createForService.mockRejectedValue(new Error("Unexpected error"));

    const res = await request(app).post("/api/tickets").send({ serviceId: 1 });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Unexpected error");
  });
});
