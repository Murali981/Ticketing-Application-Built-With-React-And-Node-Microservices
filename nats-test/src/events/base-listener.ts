import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000; // Default ack wait time of 5 seconds

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  } // Enable manual acknowledgment mode
  // Then the none-nats streaming library is no longer going to automatically acknowledge (or) tell the NATS Streaming Server that we have successfully
  // processed the message as soon as we receive it. Instead, we are going to have to manually acknowledge it by calling a function on the message object itself.
  // In other words we can say that the NATS streaming library is no longer going to automatically acknowledge (or) tell the
  // NATS streaming library that we have received the event but instead it will be upto you and I to run some processing on
  // this event, possibly save some information to the database and then after that entire process is complete then only we can
  // acknowledge the message and say okay everything has been processed successfully. If we donot acknowledge the incoming event,
  // then the NATS streaming server is going to wait some amount of time which is 30 seconds by default and then after 30 seconds
  // of not getting the acknowledgement then it is automatically decide to take this event and send it to some other member of
  // the same queue group. This is really useful because if our service crashes (or) goes down right after receiving an event
  // but before processing it and acknowledging it, then the NATS streaming server is going to automatically resend this event
  // to some other instance of our service which is listening on the same queue group. This way we can be sure that no events
  // are lost even if our service goes down at any point of time.

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received: ${this.subject} /  ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8")); // If it is a buffer then will convert it to utf8 string and then parse it to json
  }
}
