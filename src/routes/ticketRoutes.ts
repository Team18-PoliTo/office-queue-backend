import { Router } from "express";
import { postTicket } from "../controllers/ticketController";
import { requireCustomer } from "../middleware/authMiddleware";

const router = Router();

/**
 * POST /api/tickets
 * Creates a new ticket for the selected service (customer only)
 * Body: { serviceId: number }
 * Response: { id, serviceName, timestamp, waitEstimateMin }
 */
router.post("/", requireCustomer, postTicket);

export default router;
