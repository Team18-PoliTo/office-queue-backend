import { Request, Response, NextFunction } from "express";
import { ticketService } from "../services/ticketService";

export async function postTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { serviceId } = req.body as { serviceId?: number };

        // Validate request body
        if (!serviceId || Number.isNaN(Number(serviceId))) {
            return res.status(400).json({ message: "serviceId is required and must be a number." });
        }

        // Create the ticket using the service layer
        const result: any = await ticketService.createForService(Number(serviceId));

        // Return the created ticket
        return res.status(201).json(result);

    } catch (e: any) {
        // Handle "Service not found" case
        if (e?.status === 404) {
            return res.status(404).json({ message: e.message });
        }

        // Pass other errors to the global error handler
        next(e);
    }
}

