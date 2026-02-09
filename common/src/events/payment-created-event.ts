import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string; // payment id is the id of the payment in our database, we will use it to refund the payment if the order is cancelled
    orderId: string; // order id
    stripeId: string; // stripe id is the id of the payment in stripe, we will use it to refund the payment if the order is cancelled
  };
}
