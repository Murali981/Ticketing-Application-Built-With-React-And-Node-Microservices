import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator"; // This body is a method which can be used as a middleware to validate the
import { RequestValidationError } from "../errors/request-validation-error";
import { validateRequest } from "../middlewares/validate-request";
// incoming request body (or) data on the body of the POST request.

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest, // This is a middleware that we created to validate the request body using express-validator
  // If the request body is not valid then it will throw a RequestValidationError which will be caught by the error handler middleware
  (req: Request, res: Response) => {}
);

export { router as signinRouter };
