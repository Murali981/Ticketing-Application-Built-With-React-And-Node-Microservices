import mongoose from "mongoose";
import { app } from "./app";
import { natswrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  console.log("Starting.........");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  try {
    await natswrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    natswrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit(); // Exit the process when NATS connection is closed
    });

    process.on("SIGINT", () => {
      natswrapper.client.close();
    }); // Interrupt signal (Ctrl+C), This is watching for the interrupt signal at anytime when the ts-node-dev tries to restart
    // our program at anytime when you hit ctrl + C at our terminal. So we are going to intercept this request through this
    // SIGINT event and then we are going to close the NATS connection before exiting the program.

    process.on("SIGTERM", () => {
      natswrapper.client.close();
    }); // Termination signal , This is watching for the termination signal at anytime when the container in which our service is running
    // is being shutdown. So we are going to intercept this request through this SIGTERM event and then we are going to close
    // the NATS connection before exiting the program.

    new TicketCreatedListener(natswrapper.client).listen(); // Instantiating the TicketCreatedListener class and calling the listen method to start listening for events.
    new TicketUpdatedListener(natswrapper.client).listen(); // Instantiating the TicketUpdatedListener class and calling the listen method to start listening for events.
    new ExpirationCompleteListener(natswrapper.client).listen(); // Instantiating the ExpirationCompleteListener class and calling the listen method to start listening for events.
    new PaymentCreatedListener(natswrapper.client).listen(); // Instantiating the PaymentCreatedListener class and calling the listen method to start listening for events.

    await mongoose.connect(process.env.MONGO_URI); // Here we are connecting to the mongoDB instance which is running on another pod. So we have
    // to go through the clusterIP service to connect to the mongoDB instance which is running on that pod.
    // auth in /auth is name of the database which is auth that we want to create.
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!");
  });
};

start();
