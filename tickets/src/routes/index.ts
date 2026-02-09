import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@mjtickets981/common";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@mjtickets981/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  }); // Only return tickets that are not reserved
  res.send(tickets);
});

export { router as indexTicketRouter };
