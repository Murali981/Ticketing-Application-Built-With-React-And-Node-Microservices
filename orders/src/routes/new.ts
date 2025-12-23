import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@mjtickets981/common";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // This is a custom validator to check if the ticketId is a valid MongoDB ObjectId.
      .withMessage("TicketId must be provided"),
  ],
  validateRequest, // This middleware will check if there are any validation errors. If there are any validation errors then it will
  // automatically send a 400 response back to the client with the validation errors.
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
