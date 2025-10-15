import { ServiceRepository } from "../../../src/repositories/ServiceRepository";
import ServiceDAO from "../../../src/models/dao/ServiceDAO";

const mockFind = jest.fn();

jest.mock("../../../src/config/database", () => ({
  AppDataSource: {
    getRepository: () => ({
      find: mockFind,
    }),
  },
}));


describe("ServiceRepository", () => {
  const repo = new ServiceRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("should return all services", async () => {
    const mockServices: ServiceDAO[] = [
      { id: 1, name: "A" } as ServiceDAO,
      { id: 2, name: "B" } as ServiceDAO,
      { id: 3, name: "C" } as ServiceDAO,
      { id: 4, name: "D" } as ServiceDAO,
    ];
    mockFind.mockResolvedValue(mockServices);

    const services = await repo.findAll();

    expect(services).toEqual(mockServices);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

});
