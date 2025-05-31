import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Express distinguishes between a error handling middleware and a normal one on the no of arguments that the
  // function accepts. Here we want to produce errors if the request is not valid.

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are any errors then we want to throw a RequestValidationError
    throw new RequestValidationError(errors.array());
  }

  next(); // If there are no errors then we want to call the next middleware in the chain.
  // This is how we can validate the request body using express-validator and throw a custom error if the validation fails.
};
