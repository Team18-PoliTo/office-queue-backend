import express from "express";
import request from "supertest";
import ServiceController from "../../../src/controllers/serviceController";
import { ServiceDTO } from "../../../src/models/dto/ServiceDTO";

describe("ServiceController (Integration)", () => {
  let app: express.Express;

  beforeAll(() => {
    const mockServiceService = {
      getAllServices: jest.fn().mockResolvedValue([
        { id: 1, name: "Registration"},
        { id: 2, name: "Payments"},
      ] as ServiceDTO[]),
    };

    const controller = new ServiceController(mockServiceService);

    app = express();
    app.get("/api/services", controller.getAllServices.bind(controller));
  });

  it("should return all services", async () => {
    const res = await request(app).get("/api/services");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Registration");
  });

  it("should handle errors from service layer", async () => {
    const errorService = {
      getAllServices: jest.fn().mockRejectedValue(new Error("DB failure")),
    };
    const controller = new ServiceController(errorService);
    const errorApp = express();
    errorApp.get("/api/services", controller.getAllServices.bind(controller));

    const res = await request(errorApp).get("/api/services");
    expect(res.status).toBe(500); 
  });
});
