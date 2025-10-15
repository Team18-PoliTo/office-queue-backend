// test/services/ticketService.test.ts

// --- Mocks must be defined BEFORE importing the module under test ---
const mockFindById = jest.fn();
jest.mock("../../src/repositories/ServiceRepository", () => ({
  ServiceRepository: jest.fn().mockImplementation(() => ({
    // Simulate DB lookup for a service
    findById: mockFindById,
  })),
}));

const mockCreate = jest.fn();
jest.mock("../../src/services/queueService", () => ({
  // Simulate the in-memory queue service
  queueService: { create: mockCreate },
}));

// Import the service AFTER mocks are set up
import { ticketService } from "../../../src/services/ticketService";

describe("TicketService.createForService (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws 404 when the service does not exist", async () => {
    // Arrange
    mockFindById.mockResolvedValueOnce(null);

    // Act + Assert
    await expect(ticketService.createForService(999)).rejects.toMatchObject({
      message: "Service not found",
      status: 404,
    });

    // Verify interactions
    expect(mockFindById).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(999);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("enqueues a ticket and returns a DTO with an ISO timestamp", async () => {
    // Arrange: service exists
    mockFindById.mockResolvedValueOnce({
      id: 1,
      name: "A",
      avg_process_time: 5,
    });

    // Arrange: queue returns a predictable ticket
    const fixedDate = new Date("2025-01-01T12:00:00.000Z");
    mockCreate.mockReturnValueOnce({
      id: 42,
      serviceName: "A",
      timestamp: fixedDate,
    });

    // Act
    const dto = await ticketService.createForService(1);

    // Assert: repository and queue were called correctly
    expect(mockFindById).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith("A");

    // Assert: response shape and ISO timestamp conversion
    expect(dto).toEqual({
      id: 42,
      serviceName: "A",
      timestamp: fixedDate.toISOString(),
      waitEstimateMin: null,
    });
    expect(() => new Date(dto.timestamp).toISOString()).not.toThrow();
  });
});
