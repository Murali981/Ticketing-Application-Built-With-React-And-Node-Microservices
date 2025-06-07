import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

// Before all our tests start up we are going to create a new instance of the MongoDB memory server. This is going to start up a copy
// of MongoDB in memory. This is going to allow us to run multiple different test suites at the same time accross different projects. Without
// them all trying to reach out to the same copy of MongoDB. Mongo memory server also gives us direct memory access (or) essentially direct
// access to this MongoDB database which is going to be little bit handy for couple of other reasons as well.

let mongo: any; // This is going to hold the instance of the MongoDB memory server. We are going to use this to stop the MongoDB memory server after all the tests are done.

beforeAll(async () => {
  process.env.JWT_KEY = "asdf"; // This is going to set the JWT_KEY environment variable. We are going to use this to sign the JWT tokens in our tests.

  mongo = await MongoMemoryServer.create(); // This is going to create a new instance of the MongoDB memory server.
  const mongoUri = mongo.getUri(); // This is going to give us the URI that we can use to connect to this MongoDB memory server.

  await mongoose.connect(mongoUri, {}); // Here we are connecting to the MongoDB memory server using mongoose. This is going to create a new database
  // in memory that we can use for our tests. We are not passing any options to mongoose.connect() because we are using the default options.
}); // This beforeAll function is going to run once before all the tests in this file run. So we are going to use this to start up the MongoDB memory server.

beforeEach(async () => {
  //   const collections = await mongoose.connection.db.collections(); // This is going to get all the collections in the database. We are going to use this to delete all the documents in the database before each test.
  //   for (let collection of collections) {
  //     await collection.deleteMany({}); // This is going to delete all the documents in the collection. We are going to do this for all the collections in the database.
  //   } // This is going to reset all the data before each test we run

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not established");
  }

  const collections = await db.collections(); // Ensure db is defined before accessing collections
  for (let collection of collections) {
    await collection.deleteMany({}); // Clear all documents in the collection
  }
}); // This beforeEach function is going to run before each test in this file. We are not doing anything here right now but we can use this to reset the database
// before each test if we want to. For example, we can use this to delete all the documents in the database before each test.

afterAll(async () => {
  await mongo.stop(); // This is going to stop the MongoDB memory server. We are going to use this to stop the MongoDB memory server after all the tests are done.
  await mongoose.connection.close(); // This is going to close the connection to the MongoDB memory server. We are going to use this to close the connection to the MongoDB memory server after all the tests are done.
}); // This afterAll function is going to run once after all the tests in this file run. We are not doing anything here right now but we can use this to close the
// MongoDB memory server connection if we want to. For example, we can use this to close the connection to the MongoDB memory server after all the tests are done.
