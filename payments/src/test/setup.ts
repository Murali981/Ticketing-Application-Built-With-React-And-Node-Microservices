import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../app";
import request from "supertest";

// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): Promise<string[]>; // signin is going to be a function which is going to return a promise and this promise is
//       // going to resolve itself with a cookie which is an array of strings.
//     }
//   }
// }

// declare global {
//   var signin: () => Promise<string[]>; // signin is going to be a function which is going to return a promise and this promise is
//   //       // going to resolve itself with a cookie which is an array of strings.
// }

declare global {
  var signin: (id?: string) => string[]; // signin is going to be a function which is going to return a cookie which is an array of strings.
}

jest.mock("../nats-wrapper"); // This is going to mock the entire nats-wrapper module.

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
  jest.clearAllMocks(); // This is going to clear all the mocks before each test. We are going to use this to reset the mock implementation of the nats-wrapper module before each test.
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

// In the below we are going to write a Global function inside this file /////////////////////////////////////////////////////
// This function is going to be assigned to the global scope. So we can very easily use it from all our different test files.

// global.signin = async () => {
//   // On the global scope of node.js there is no function called signin (or) no property called signin

//   const email = "test@test.com";
//   const password = "password";

//   const response = await request(app)
//     .post("/api/users/signup")
//     .send({ email, password })
//     .expect(201);

//   const cookie = response.get("Set-Cookie");
//   // Now we want to take out the above cookie and somehow make it really easy to use inside of some follow up request.
//   // There are 2 ways we can do this, First way is simply returning the cookie.

//   if (!cookie) {
//     throw new Error("Failed to get the cookie from the response");
//   }

//   return cookie;
// };

global.signin = (id?: string) => {
  // On the global scope of node.js there is no function called signin (or) no property called signin
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(), // We can use any string here because we are not going to be actually using this id to look up a user in the database.
    // We are just going to be using this id to sign the JWT token and then we are going to be using this JWT token to authenticate our requests in our tests. So it doesn't matter
    // what string we use here as long as it's a valid MongoDB ObjectId. In the above line we are
    // checking if an id is passed in as an argument to the signin function.
    // If it is, we are going to use that id. If it's not,
    // we are going to generate a new id using mongoose.Types.ObjectId().toHexString()
    // which is going to give us a new valid MongoDB ObjectId as a string.
    email: "test@test.com",
  };
  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!); // The ! is used to tell TypeScript that we are sure that process.env.JWT_KEY is not undefined.
  // Build the session object {jwt: MY_JWT }
  const session = { jwt: token }; // This is the same object that we are encoding in the cookie-session library.
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session); // This is the same as what the cookie-session library does internally.
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64"); // This is the same as what the cookie-session library does internally.
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`]; // This is the same as what the cookie-session library does internally.
  // We are returning an array because supertest expects the cookie to be an array of strings.
  // Turn the session object into JSON
  // Take JSON and encode it as base64
  // return a string thats the cookie with the encoded data
};
