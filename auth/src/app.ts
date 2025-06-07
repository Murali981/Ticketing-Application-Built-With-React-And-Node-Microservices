import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { NextFunction, Request, Response } from "express";

const app = express();
app.set("trust proxy", true); // This is to tell express that we are behind a reverse proxy like nginx or AWS ELB.
// This is important because we are going to be using cookie-session and we want to make sure that the cookie is secure.
app.use(json());
app.use(
  cookieSession({
    signed: false, // We are not signing the cookie so that we can read the cookie in the browser.
    secure: process.env.NODE_ENV !== "test", // If we are in production then we want to set the secure flag to true.
    // This means that the cookie will only be sent over HTTPS connections.
    // In test environment we don't have HTTPS so we set it to false.
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
}); // As soon as we throw the above NotFoundError() then Express is going to capture this error and send (or) pass it to the
// below errorHandler middleware then the below errorHandler middleware is going to take the statusCode and then call the
// serializeErrors() function and it is going to generate a response and automaatically send back a response back to whoever
// is trying to access this route which is not existing.

// I have only modified the below one

// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   next(new NotFoundError());
// });

// How it is working now but before when the route is like this app.all("*", () => {    throw new NotFoundError()}); is not working

// I'm glad that modifying the catch-all route fixed the issue! Let me explain why this change worked and why the previous version was causing problems.

// Why the Fix Worked
// typescript
// // Previous (problematic) version:
// app.all("*", () => {
//   throw new NotFoundError();
// });

// // New (working) version:
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   next(new NotFoundError());
// });
// There are two important differences here:

// 1. Proper Parameter Declaration
// In the new version, you've explicitly declared all the parameters that Express expects for a route handler: (req, res, next). This gives TypeScript the proper context to understand this is an Express route handler.

// In the old version, you had an empty parameter list (), which made TypeScript unable to infer this was an Express route handler. Without the proper context, TypeScript couldn't connect this route handler to the error handler middleware.

// 2. Using next() Instead of throw
// In Express, there are two ways to pass errors to error-handling middleware:

// Using next(error) - This is the explicit, recommended approach
// Throwing an error (throw error) - This works in synchronous route handlers but relies on Express's internal error catching
// When you use next(error), you're explicitly telling Express to pass the error to the next error-handling middleware. This makes the connection between your route handler and error handler clear to both Express and TypeScript.

// When you use throw error, TypeScript doesn't automatically understand the connection to Express's error handling system. It sees a function that might throw an error, but doesn't connect that to the error handler middleware you registered later.

// The TypeScript Error Chain
// The previous approach created a chain reaction of type errors:

// The catch-all route handler wasn't properly identified as an Express route handler because it lacked the parameters
// This affected how TypeScript understood the error flow when you threw the NotFoundError
// When the error eventually reached your error handler, TypeScript couldn't properly verify the types matched up
// This resulted in the error you were seeing when registering the error handler with app.use(errorHandler)
// By properly declaring the route handler parameters and using next(error), you've fixed this entire chain of type inference problems.

// Best Practice Going Forward
// For Express route handlers in TypeScript, always:

// Declare all three parameters: (req: Request, res: Response, next: NextFunction) => {}
// Use next(error) rather than throw error for passing errors to middleware
// Follow the correct Express middleware pattern for error handlers: (err: Error, req: Request, res: Response, next: NextFunction) => {}
// This ensures TypeScript can properly type-check your Express application and avoids these confusing errors.

// app.all("*", async (req: Request, res: Response, next: NextFunction) => {
//   next(new NotFoundError());
// });

app.use(errorHandler);

export { app };
