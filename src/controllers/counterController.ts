import { Request, Response, NextFunction } from "express";
// Counter Controller

import ICounterService from "../services/counterService";
import QueueService, { queueService } from "../services/queueService";

class CounterController {
  constructor(private counterService: ICounterService) {}

  async getCounterById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const counter = await this.counterService.getCounterFromId(id);
      if (!counter) {
        res.status(404).json({ message: "Counter not found" });
        return;
      }
      res.json(counter);
    } catch (err) {
      next(err);
    }
  }


  async getNextCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const counter = await this.counterService.getCounterFromId(id);

      if (!counter) {
        res.status(404).json({ message: "Counter not found" });
        return;
      }

      const nextTicket = queueService.getNextTicket(counter.services);
      res.send(nextTicket);

    } catch (error) {
      next(error);
    }
  }

}

export default CounterController;
