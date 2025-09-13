import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@mjtickets981/common";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@mjtickets981/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({}); // This empty object means give me all the tickets which are inside this collection.
  res.send(tickets);
});

export { router as indexTicketRouter };
