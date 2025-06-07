import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth"); // Here we are connecting to the mongoDB instance which is running on another pod. So we have
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
