// Publisher is going to emit an event to the NATS streaming server
import { Publisher, Subjects, TicketCreatedEvent } from "@mjtickets981/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
