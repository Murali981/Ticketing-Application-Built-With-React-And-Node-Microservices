import express, { Request, Response } from "express";
import { requireAuth } from "@mjtickets981/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuth(),
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "ticket",
    ); // Here we are fetching all the orders for a particular user from the database.
    // We are using the populate method to automatically replace the ticket property of each order with the actual ticket document from the tickets collection.
    // This is possible because we have defined a reference to the Ticket model in the Order model.

    res.send(orders);
  },
);

export { router as indexOrderRouter };
