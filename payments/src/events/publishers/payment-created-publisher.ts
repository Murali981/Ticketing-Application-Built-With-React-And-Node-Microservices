import { Subjects, Publisher, PaymentCreatedEvent } from "@mjtickets981/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
