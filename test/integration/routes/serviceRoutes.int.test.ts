import express from "express";
import request from "supertest";
import ServiceController from "../../../src/controllers/serviceController";
import ServiceService from "../../../src/services/serviceService";
import { validateUserType, requireCustomer } from "../../../src/middleware/authMiddleware";

const mockServiceRepository = {
  findAll: jest.fn().mockResolvedValue([
    { id: 1, name: "Payments", avg_process_time: 5 },
    { id: 2, name: "Registration", avg_process_time: 10 },
  ]),
};

describe("Service Routes (Integration)", () => {
  let app: express.Express;

  beforeAll(() => {
    const serviceService = new ServiceService(mockServiceRepository);
    const serviceController = new ServiceController(serviceService);

    app = express();
    app.use(express.json());
    app.get("/api/services", validateUserType, requireCustomer, serviceController.getAllServices.bind(serviceController));
  });

  it("GET /services should return list of services", async () => {
    const res = await request(app).get("/api/services").set("user-type", "customer");
    console.log(res.status, res.body);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Payments");
  });
});
