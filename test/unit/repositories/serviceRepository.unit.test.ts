import ServiceRepository from "../../../src/repositories/ServiceRepository";
import ServiceDAO from "../../../src/models/dao/ServiceDAO";
import { Repository } from "typeorm";

describe("ServiceRepository", () => {
  it("should return all services", async () => {
    const mockFind = jest.fn().mockResolvedValue([
      { id: 1, name: "A" } as ServiceDAO,
      { id: 2, name: "B" } as ServiceDAO,
      { id: 3, name: "C" } as ServiceDAO,
      { id: 4, name: "D" } as ServiceDAO,
    ] as ServiceDAO[]);
    const mockRepo = { find: mockFind } as unknown as Repository<ServiceDAO>;

    const repo = new ServiceRepository(mockRepo);
    const services = await repo.findAll();

    expect(services).toEqual([
      { id: 1, name: "A" } as ServiceDAO,
      { id: 2, name: "B" } as ServiceDAO,
      { id: 3, name: "C" } as ServiceDAO,
      { id: 4, name: "D" } as ServiceDAO,
    ]);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });
});
