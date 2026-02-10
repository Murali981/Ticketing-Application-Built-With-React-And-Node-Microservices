import mongoose from "mongoose";
import { app } from "./app";
import { natswrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
  console.log("Starting the server...");
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

    // listeners
    new OrderCreatedListener(natswrapper.client).listen(); // here we are creating an instance of the OrderCreatedListener class
    // and calling the listen method to start listening for events, Why we have to call listen() method here?
    // Because the listen() method is responsible for setting up the subscription to the NATS streaming server
    // and handling incoming messages for the specific event type that the listener is interested in.
    new OrderCancelledListener(natswrapper.client).listen(); // here we are creating an instance of the OrderCancelledListener class
    // and calling the listen method to start listening for events, Why we have to call listen() method here?
    // Because the listen() method is responsible for setting up the subscription to the NATS streaming server
    // and handling incoming messages for the specific event type that the listener is interested in.

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
