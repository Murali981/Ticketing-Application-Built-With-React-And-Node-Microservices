import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string; // Optional orderId to indicate reservation status. It is marked as
    // optional because not all ticket updates will involve reservation.
  };
}
