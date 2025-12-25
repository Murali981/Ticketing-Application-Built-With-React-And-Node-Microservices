import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@mjtickets981/common";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    // First off all we need to find the order that the user is trying to cancel where we are going to pull it from the
    // req.params.orderId
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      // We are checking if the userId associated with the order matches the id of the currently logged in user.
      // If they don't match we throw a NotAuthorizedError.
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled; // We are updating the status of the order to cancelled.
    await order.save(); // We are saving the updated order back to the database.

    res.send(order);
  }
);

export { router as deleteOrderRouter };
