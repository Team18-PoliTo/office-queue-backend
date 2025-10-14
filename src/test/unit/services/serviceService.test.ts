// src/test/unit/services/serviceService.test.ts
import ServiceService from "../../../services/serviceService";
import ServiceDAO from "../../../models/dao/ServiceDAO";
import { ServiceDTO } from "../../../models/dto/ServiceDTO";

// Mock ServiceMapper (named export with a static method)
jest.mock("mappers/ServiceMapper", () => ({
    ServiceMapper: {
        toDTOList: jest.fn(),
    },
}));

import { ServiceMapper } from "../../../mappers/ServiceMapper";

type IServiceRepository = {
    findAll: () => Promise<ServiceDAO[]>;
};

describe("ServiceService", () => {
    let repoMock: jest.Mocked<IServiceRepository>;
    let toDTOListMock: jest.MockedFunction<typeof ServiceMapper.toDTOList>;

    beforeEach(() => {
        repoMock = { findAll: jest.fn() };
        toDTOListMock = ServiceMapper.toDTOList as jest.MockedFunction<
            typeof ServiceMapper.toDTOList
        >;
        jest.clearAllMocks();
    });

    it("getAllServices() returns mapped DTOs", async () => {
        // Arrange
        const daos: ServiceDAO[] = [
            { id: 1, name: "Service A", avg_process_time: 120, counters: [] as any } as ServiceDAO,
            { id: 2, name: "Service B", avg_process_time: 90,  counters: [] as any } as ServiceDAO,
        ];
        repoMock.findAll.mockResolvedValueOnce(daos);

        const dtos: ServiceDTO[] = [
            { id: 1, name: "Service A", avg_process_time: 120 } as ServiceDTO,
            { id: 2, name: "Service B", avg_process_time: 90 } as ServiceDTO,
        ];
        toDTOListMock.mockReturnValueOnce(dtos);

        // Act
        const service = new ServiceService(repoMock as unknown as IServiceRepository);
        const result = await service.getAllServices();

        // Assert
        expect(repoMock.findAll).toHaveBeenCalledTimes(1);
        expect(toDTOListMock).toHaveBeenCalledWith(daos);
        expect(result).toEqual(dtos);
    });

    it("getAllServices() returns empty array when no data", async () => {
        repoMock.findAll.mockResolvedValueOnce([]);
        toDTOListMock.mockReturnValueOnce([]);

        const service = new ServiceService(repoMock as unknown as IServiceRepository);
        const result = await service.getAllServices();

        expect(repoMock.findAll).toHaveBeenCalledTimes(1);
        expect(toDTOListMock).toHaveBeenCalledWith([]);
        expect(result).toEqual([]);
    });

    it("getAllServices() propagates repository error", async () => {
        const err = new Error("DB is down");
        repoMock.findAll.mockRejectedValueOnce(err);

        const service = new ServiceService(repoMock as unknown as IServiceRepository);

        await expect(service.getAllServices()).rejects.toThrow(err);
        expect(toDTOListMock).not.toHaveBeenCalled();
    });
});