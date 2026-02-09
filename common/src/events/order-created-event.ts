import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string; // This represents the ID of the user who created the order.
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
