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
import { stripe } from "../stripe";
import { Payment } from "../models/payment";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth(),
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

    // Use Payment Intents API instead of Charges API
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: order.price * 100,
    //   currency: "usd",
    //   payment_method: token,
    //   confirm: true,
    //   automatic_payment_methods: {
    //     enabled: true,
    //     allow_redirects: "never",
    //   },
    // });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Here you would typically integrate with a payment processing service (e.g., Stripe) to charge the user
    const payment = Payment.build({
      orderId: order.id,
      stripeId: paymentIntent.id,
    });
    await payment.save();

    res.status(201).send({
      success: true,
      paymentIntentId: paymentIntent.id,
    });
  },
);

export { router as createChargeRouter };
