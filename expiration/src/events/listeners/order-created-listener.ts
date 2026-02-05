import { Listener, OrderCreatedEvent, Subjects } from "@mjtickets981/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); // Calculate the delay until the order expires.
    // Syntax of the above line is: new Date(data.expiresAt).getTime() - new Date().getTime()
    // new Date(data.expiresAt).getTime() gives us the timestamp of when the order expires. This is the time when the order should be cancelled if it hasn't been completed.
    // new Date().getTime() gives us the current timestamp. This is the time right now. Then we subtract
    // the current time from the expiration time to get the delay until the order expires.

    console.log("waiting this many milliseconds to process this job:", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay, // 10 seconds for testing purposes, in production this would be something like 15 minutes (15 * 60 * 1000)
      },
    );

    msg.ack();
  }
}
