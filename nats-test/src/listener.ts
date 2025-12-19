import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit(); // Exit the process when NATS connection is closed
  });

  const ticketCreatedListener = new TicketCreatedListener(stan);
  ticketCreatedListener.listen(); // Start listening for ticket:created events
});

process.on("SIGINT", () => {
  stan.close();
}); // Interrupt signal (Ctrl+C), This is watching for the interrupt signal at anytime when the ts-node-dev tries to restart
// our program at anytime when you hit ctrl + C at our terminal. So we are going to intercept this request through this
// SIGINT event and then we are going to close the NATS connection before exiting the program.

process.on("SIGTERM", () => {
  stan.close();
}); // Termination signal , This is watching for the termination signal at anytime when the container in which our service is running
// is being shutdown. So we are going to intercept this request through this SIGTERM event and then we are going to close
// the NATS connection before exiting the program.
