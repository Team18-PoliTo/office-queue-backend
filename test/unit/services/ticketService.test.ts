// test/unit/services/ticketService.test.ts
import TicketService from "../../../src/services/ticketService";
import ServiceRepository from "../../../src/repositories/ServiceRepository";

describe("TicketService.createForService (unit)", () => {
  const mockFindById = jest.fn();
  const mockCreate = jest.fn();

  const repo = { findAll: jest.fn(), findById: mockFindById } as unknown as ServiceRepository;
  const q = { create: mockCreate };

  let sut: TicketService;

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new TicketService(repo, q as any);
  });

  it("throws 404 when the service does not exist", async () => {
    mockFindById.mockResolvedValueOnce(null);

    await expect(sut.createForService(999)).rejects.toMatchObject({
      message: "Service not found",
      status: 404,
    });

    expect(mockFindById).toHaveBeenCalledWith(999);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("enqueues a ticket and returns DTO with ISO timestamp", async () => {
    mockFindById.mockResolvedValueOnce({ id: 1, name: "A", avg_process_time: 5 } as any);
    const fixedDate = new Date("2025-01-01T12:00:00.000Z");
    mockCreate.mockReturnValueOnce({ id: 42, serviceName: "A", timestamp: fixedDate });

    const dto = await sut.createForService(1);

    expect(mockFindById).toHaveBeenCalledWith(1);
    expect(mockCreate).toHaveBeenCalledWith("A");
    expect(dto).toEqual({
      id: 42,
      serviceName: "A",
      timestamp: fixedDate.toISOString()
    });
  });

  it("propagates unexpected queue errors", async () => {
    mockFindById.mockResolvedValueOnce({ id: 1, name: "A" } as any);
    mockCreate.mockImplementationOnce(() => { throw new Error("boom"); });
    await expect(sut.createForService(1)).rejects.toThrow("boom");
  });

  it("returns valid ISO 8601 timestamp", async () => {
    mockFindById.mockResolvedValueOnce({ id: 1, name: "A" } as any);
    const d = new Date();
    mockCreate.mockReturnValueOnce({ id: 7, serviceName: "A", timestamp: d });
    const dto = await sut.createForService(1);
    expect(() => new Date(dto.timestamp).toISOString()).not.toThrow();
  });
});