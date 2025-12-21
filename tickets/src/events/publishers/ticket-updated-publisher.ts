// Publisher is going to emit an event to the NATS streaming server
import { Publisher, Subjects, TicketUpdatedEvent } from "@mjtickets981/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
