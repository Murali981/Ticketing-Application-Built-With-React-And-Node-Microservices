import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  // We will extend this class for each specific event listener
  // to build out different classes for different event listeners. Inside of our services where each service
  // is going to be responsible for listening to different types of events. So for example, the
  // orders service is going to be responsible for listening to order created events
  // and order cancelled events. So we will create different classes for each of those event listeners.
  // Whenever we want to extend this listener class we have to specify the type of event that we are listening to like a generic
  // type event and inside of the child class we are going to specify the subject and the data that we are expecting to receive for that particular event.
  // This way we can have type safety and autocompletion when we are working with different event listeners. And also the
  // queueGroupName is going to be different for each service. So we will specify that in the child class as well.
  // The onMessage function is going to be different for each event listener as well because we are going to have different logic
  // for each event listener. So we will implement that in the child class as well. Whenever we are going to create
  // an instance for the listener then we are going to provide NATS client to it.
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected client: Stan;
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
      this.subscriptionOptions(),
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received: ${this.subject} /  ${this.queueGroupName}`,
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
