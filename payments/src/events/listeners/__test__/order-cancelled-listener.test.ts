import { OrderCancelledListener } from "../order-cancelled-listener";
import { natswrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { OrderStatus, OrderCancelledEvent } from "@mjtickets981/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natswrapper.client);

  // Create a new order and save it to the database
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "asasxxas",
    version: 0,
  });

  await order.save();

  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asdasd",
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg); // call the onMessage function with the data object + message object
  // What exactly this onMessage does is, it finds the order by id, updates its status to cancelled, and saves it to the database.

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg); // call the onMessage function with the data object + message object
  // What exactly this onMessage does is, it finds the order by id, updates its status to cancelled, and saves it to the database.

  expect(msg.ack).toHaveBeenCalled();
});
