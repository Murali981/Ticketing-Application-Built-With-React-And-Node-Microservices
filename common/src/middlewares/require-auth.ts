import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireAuth = () => {
  // We are going to really make a big assumption here where we are going to assume that we will never use the requiredAuth middleware
  // in a situation where the user is not logged in. So we are going to assume that the currentUser property is always set on the request object.
  // By the time this request shows up inside the requireAuth middleware, We should already checked to see if there is a JSON Web Token
  // is present (or) not. We should have already attempted to decode it and set it on the req.currentUser property. Again if the
  // req.currentUser property is not defined then it means that we have to reject this request and respond with an error.
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      // If the currentUser property is not set then it means that the user is not logged in
      //   return res.status(401).send({ error: "Not authorized" });
      throw new NotAuthorizedError();
    }
    next(); // If the user is logged in, we call next() to continue to the next middleware
  };
};
