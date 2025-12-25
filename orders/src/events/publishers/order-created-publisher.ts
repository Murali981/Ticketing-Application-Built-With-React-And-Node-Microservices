import { Publisher, OrderCreatedEvent, Subjects } from "@mjtickets981/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
