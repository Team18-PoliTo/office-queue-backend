import { Router } from "express";
import { postTicket } from "../controllers/ticketController";
// import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/**
 * POST /api/Ticket
 * Creates a new ticket for the selected service.
 * Body: { serviceId: number }
 * Response: { id, serviceName, timestamp, waitEstimateMin }
 */
router.post("/", /* authMiddleware, */ postTicket);

export default router;
