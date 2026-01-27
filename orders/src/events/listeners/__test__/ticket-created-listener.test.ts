import { natswrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { TicketCreatedEvent } from "@mjtickets981/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natswrapper.client); // Whenever we have created an instance of
  // a listener, we need to pass in the NATS client. We can get this from the natsWrapper we created earlier.
  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(), // we are generating a new id here instead of using some hardcoded string because
    // mongoose ids have a specific format. So to make sure our tests are as close to reality as possible, we generate a new id using mongoose.
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(), // we are creating a fake ack function using jest.fn()
  };

  return { listener, data, msg }; // return all of this stuff because we will need it in our tests.
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id); // we are trying to find the ticket
  // that we expect to have been created by the listener.

  expect(ticket).toBeDefined(); // we expect that ticket to be defined
  expect(ticket!.title).toEqual(data.title); // we expect the title of the ticket to be equal to the title in the data object
  expect(ticket!.price).toEqual(data.price); // we expect the price of the ticket to be equal to the price in the data object
});

it("it acks the message", async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
