import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@mjtickets981/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body; // Extract token and orderId from the request body

    // Find the order in the database using the provided orderId
    const order = await Order.findById(orderId);

    // If the order does not exist, throw a NotFoundError
    if (!order) {
      throw new NotFoundError();
    }
    // If the order does not belong to the current user, throw a NotAuthorizedError
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // If the order has been cancelled, throw a BadRequestError
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    // Here you would typically integrate with a payment processing service (e.g., Stripe) to charge the user
    res.send({ success: true, message: "Payment processed successfully" });
  },
);

export { router as createChargeRouter };
