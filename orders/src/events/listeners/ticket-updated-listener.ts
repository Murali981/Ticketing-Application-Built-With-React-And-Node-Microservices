import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@mjtickets981/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // How this onMessage will get triggered? It will get triggered when a TicketUpdatedEvent is published.
    // const ticket = await Ticket.findOne({
    //   _id: data.id, // Find the ticket by id and why it is _id because in mongoDB the primary key field is always _id.
    //   version: data.version - 1, // Find the ticket with the previous version number. Why version - 1? Because we
    //   // want to make sure that we are processing the events in the correct order. And also why version in the
    //   // left side because we have set the versionKey to version in the ticket model. What if we don't set the
    //   // versionKey to version? Then we have to use __v instead of version.
    // });

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack(); // Acknowledge the message after successful processing.
  }
}
