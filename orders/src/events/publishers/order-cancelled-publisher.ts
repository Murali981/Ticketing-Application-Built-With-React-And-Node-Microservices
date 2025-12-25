import { Publisher, OrderCancelledEvent, Subjects } from "@mjtickets981/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
