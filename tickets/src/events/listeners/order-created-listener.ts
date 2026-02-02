import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@mjtickets981/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving.
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket throw an error.
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Mark the ticket as being reserved by setting its orderId property.
    ticket.set({ orderId: data.id });
    // Save the ticket.
    await ticket.save();
    // Publish a ticket updated event.
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    }); // Why are we putting await here? Because we want to make sure that the event is published before we ack the message.
    // what if we didn't put await here? The message would be acked before the event is published.
    //  If the event fails to publish, we would have an inconsistent state where the ticket is reserved but the order created event is not published.
    // ack the message
    msg.ack();
  }
}
