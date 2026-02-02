import { natswrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@mjtickets981/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natswrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "asdf",
  });

  ticket.set({ orderId }); // mark the ticket as being reserved, What does .set() do here?
  // It sets the orderId property of the ticket to the given orderId value.

  await ticket.save();

  // Create the fake data event (or) build the fake data event
  const data: OrderCancelledEvent["data"] = {
    version: 0,
    id: orderId,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  // Create a fake message object
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined(); // because the order is cancelled, so the ticket should be unreserved

  expect(msg.ack).toHaveBeenCalled(); // to check whether the ack function is called or not

  // to check whether the publish function is called or not
  expect(natswrapper.client.publish).toHaveBeenCalled(); // Why are we using toHaveBeenCalled() here?
  // Because we want to verify that the publish method was indeed called during the test execution.
});
