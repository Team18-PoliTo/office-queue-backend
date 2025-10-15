// test/unit/services/counterService.test.ts
import CounterService from "../../../src/services/counterService";
import CounterRepository from "../../../src/repositories/CounterRepository";

jest.mock("../../../src/repositories/CounterRepository");

describe("CounterService", () => {
  let service: CounterService;
  let repoMock: jest.Mocked<CounterRepository>;

  beforeEach(() => {
    repoMock = new CounterRepository() as jest.Mocked<CounterRepository>;
    repoMock.findById = jest.fn();
    service = new CounterService(repoMock);
  });

  it("returns null when counter is not found", async () => {
    repoMock.findById.mockResolvedValueOnce(null);

    const result = await service.getCounterById(10);

    expect(result).toBeNull();
    expect(repoMock.findById).toHaveBeenCalledWith(10);
  });

  it("returns mapped DTO when counter exists", async () => {
    repoMock.findById.mockResolvedValueOnce({
      id: 2,
      name: "Main Counter",
      services: [],
    } as any);

    const dto = await service.getCounterById(2);
    console.log("DTO::")
    console.log(dto)

    expect(dto).toEqual({
      id: 2,
      name: "Main Counter",
      services: [],
    });
  });
});
