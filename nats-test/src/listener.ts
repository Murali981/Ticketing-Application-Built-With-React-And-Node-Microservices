import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const options = stan.subscriptionOptions().setManualAckMode(true); // Enable manual acknowledgment mode
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
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data} `);
    }

    msg.ack(); // Manually acknowledge the message after processing
  });
});
