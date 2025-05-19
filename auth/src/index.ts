import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", () => {
  throw new NotFoundError();
}); // As soon as we throw the above NotFoundError() then Express is going to capture this error and send (or) pass it to the
// below errorHandler middleware then the below errorHandler middleware is going to take the statusCode and then call the
// serializeErrors() function and it is going to generate a response and automaatically send back a response back to whoever
// is trying to access this route which is not existing.

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!!!");
});
