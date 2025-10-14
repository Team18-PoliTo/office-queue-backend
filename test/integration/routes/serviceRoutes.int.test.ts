import express from "express";
import request from "supertest";
import ServiceController from "../../../src/controllers/serviceController";
import ServiceService from "../../../src/services/serviceService";

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
    app.get("/api/services", serviceController.getAllServices.bind(serviceController));
  });

  it("GET /services should return list of services", async () => {
    const res = await request(app).get("/api/services");
    console.log(res.status, res.body);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Payments");
  });
});
