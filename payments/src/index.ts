import mongoose from "mongoose";
import { app } from "./app";
import { natswrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
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

    new OrderCreatedListener(natswrapper.client).listen(); // Here we are creating an instance of the OrderCreatedListener class and
    // then we are calling the listen method on that instance to start listening for the events whenever the application starts.
    // So whenever the application starts, it will start listening for the events and whenever it receives an event,
    // it will call the onMessage function of that listener class.
    new OrderCancelledListener(natswrapper.client).listen(); // Here we are creating an instance of the OrderCancelledListener class and
    // then we are calling the listen method on that instance to start listening for the events whenever the application starts.
    // So whenever the application starts, it will start listening for the events and whenever it receives an event,
    // it will call the onMessage function of that listener class.

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
