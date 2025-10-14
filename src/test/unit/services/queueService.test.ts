// services/queueService.test.ts
import QueueService from "../../../services/queueService";

describe("QueueService (unit)", () => {
    let qs: QueueService;

    beforeEach(() => {
        qs = new QueueService();
    });

    test("create() assigns incremental ids and tickets in correct queue", () => {
        const t1 = qs.create("A");
        const t2 = qs.create("A");
        const t3 = qs.create("B");

        expect(t1.id).toBe(1);
        expect(t2.id).toBe(2);
        expect(t3.id).toBe(3);

        expect(qs.size("A")).toBe(2);
        expect(qs.size("B")).toBe(1);
    });

    test("timestamp is a valid Date", () => {
        const t = qs.create("A");
        expect(t.timestamp instanceof Date).toBe(true);
        expect(() => t.timestamp.toISOString()).not.toThrow();
    });

    test("next() returns FIFO and null when empty", () => {
        qs.create("A");
        const t2 = qs.create("A");

        const n1 = qs.next("A");
        const n2 = qs.next("A");
        const n3 = qs.next("A");

        expect(n1?.id).toBe(1);
        expect(n2?.id).toBe(2);
        expect(n3).toBeNull();
    });

    test("size() and hasNext() reflect queue length", () => {
        expect(qs.size("A")).toBe(0);
        expect(qs.hasNext("A")).toBe(false);

        qs.create("A");
        expect(qs.size("A")).toBe(1);
        expect(qs.hasNext("A")).toBe(true);
    });

    test("reset() clears queues and id counter", () => {
        qs.create("A");
        qs.create("B");
        expect(qs.size("A")).toBe(1);
        expect(qs.size("B")).toBe(1);

        qs.reset();
        expect(qs.size("A")).toBe(0);
        expect(qs.size("B")).toBe(0);

        const t = qs.create("A");
        expect(t.id).toBe(1);
    });
});
