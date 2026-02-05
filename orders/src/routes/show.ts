import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@mjtickets981/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth(),
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket"); // When we fetch the order we want to simultaneously fetch the associated ticket as well.
    // So we can use the populate method provided by mongoose to do that.
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      // We are checking if the userId associated with the order matches the id of the currently logged in user.
      // If they don't match we throw a NotAuthorizedError.
      throw new NotAuthorizedError();
    }
    res.send(order);
  },
);

export { router as showOrderRouter };
