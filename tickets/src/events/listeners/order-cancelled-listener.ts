import { Listener, OrderCancelledEvent, Subjects } from "@mjtickets981/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving.
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket throw an error.
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being unreserved by clearing its orderId property.
    ticket.set({ orderId: undefined });
    await ticket.save();

    // Publish a ticket updated event.
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    }); // When we are publishing this event, Can the properties inside can be of any order like id, title, price or userId first?
    // Yes, the order of properties in an object does not matter in JavaScript. What matters is that all required properties are included and have the correct values.

    // Acknowledge the message
    msg.ack();
  }
}
