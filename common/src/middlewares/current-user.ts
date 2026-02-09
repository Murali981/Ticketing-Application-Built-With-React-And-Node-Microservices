import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload; // We are going to attach the currentUser property to the request object
      // and this property is going to be of type UserPayload which we defined above.
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    // If the jwt property is not set then it means that the user is not logged in
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload; // Whenever we call the verify() here then we are going to get back
    // a payload either a string (or) an object. This is goping to be the information that we stored inside the jwt when we created it.
    // If the jwt is valid, we can attach the payload to the request object. If you recall about the JWT, inside the payload we have an
    // ID property which is a string and email which is a string. So we are going to first create an interface for the payload and then
    // we are going to use that interface to type the payload variable.
    req.currentUser = payload; // Attach the current user to the request object.
    // When we are trying to assign the currentUser property to the request object and TypeScript is unhappy about that because typescript
    // has a type definition file for express that defines exactly what a request is, and this type definition file says that a request
    // doesnot have a property of currentUser. So we need to somehow augment the definition of what a request is. So we are going to
    // add a additional property to the type definition of what a request is.
  } catch (err) {
    // If the jwt is invalid, we can just ignore it and continue
  }

  next(); // Whether the jwt is valid or not, we call next() to continue to the next middleware
};
