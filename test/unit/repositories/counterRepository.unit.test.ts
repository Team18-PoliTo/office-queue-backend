import { AppDataSource } from "../../../src/config/database";
import CounterDAO from "../../../src/models/dao/CounterDAO";

jest.mock("../../../src/config/database", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("CounterRepository", () => {
  let CounterRepository: any;
  let counterRepository: any;
  const mockRepo = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

    jest.isolateModules(() => {
      CounterRepository = require("../../../src/repositories/CounterRepository").default;
      counterRepository = new CounterRepository();
    });
  });

  it("should return counter by ID", async () => {
    const fakeCounter = { id: 1, name: "A", services: [] } as CounterDAO;
    mockRepo.findOne.mockResolvedValueOnce(fakeCounter);

    const result = await counterRepository.findById(1);
    expect(result).toEqual(fakeCounter);
  });

  it("should return null if counter not found", async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);

    const result = await counterRepository.findById(999);

    expect(result).toBeNull();
  });
});
