// The only requirement we need when we write error handling middleware is , The function in this error handling middleware
// it has to recieve 4 arguments and the order of these arguments are the error, req, res, next

import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
// import { ErrorRequestHandler } from "express";
// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   console.log("Something went wrong", err);

  //   if (err instanceof RequestValidationError) {
  //     // const formattedErrors = err.errors.map((error) => {
  //     //   return {
  //     //     message: error.msg,
  //     //     field: error.param,
  //     //   };
  //     // });
  //     // const formattedErrors = err.errors.map((error) => {
  //     //   if (error.type === "field") {
  //     //     return { message: error.msg, field: error.path };
  //     //   }
  //     // });
  //     return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  //   }

  //   if (err instanceof DatabaseConnectionError) {
  //     // console.log("handling this error as a DB connection error");
  //     return res.status(err.statusCode).send({
  //       errors:
  //         //    [
  //         //     {
  //         //       message: err.reason,
  //         //     },
  //         //   ],
  //         err.serializeErrors(),
  //     });
  //   }

  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  res.status(400).send({
    errors: [
      {
        message: "something went wrong",
      },
    ],
  });
};
