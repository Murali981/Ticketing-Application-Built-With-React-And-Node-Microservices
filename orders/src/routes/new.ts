import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mjtickets981/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natswrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 1 minute

router.post(
  "/api/orders",
  requireAuth(),
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
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved(); // This is how we add a method directly to a document instance in Mongoose.
    // Make sure that this ticket is not already reserved. The entire idea here to reserve the ticket for 15min is, we are
    // planning an idea of our application, getting a lot of traffic and a lot of people trying to buy the same tickets at the
    // same point in time.
    // If a ticket has been reserved means that this ticket is already associated with an order that has not been cancelled.
    // And top of this the status of the order should be something other than cancelled.
    // We have to run a query to look at all the orders. Then we have to find an order where the ticket is the ticket that
    // we just fetched and the order's status should be something other than cancelled.
    // If we find an order from this then that means that the ticket is already reserved.
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); // Setting the expiration time to 15 minutes from now.

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id, // ! is used to tell typescript that we are sure that currentUser is not null or undefined here.
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save(); // Saving the order to the database.
    // publishing an event saying that an order was created
    new OrderCreatedPublisher(natswrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
