// The only requirement we need when we write error handling middleware is , The function in this error handling middleware
// it has to recieve 4 arguments and the order of these arguments are the error, req, res, next

import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Something went wrong", err);

  res.status(400).send({
    message: "Something went wrong",
  });
};
