import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";
import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@mjtickets981/common"; // Importing validateRequest and BadRequestError from the common package
// validateRequest is a middleware that we created to validate the request body using express-validator
import jwt from "jsonwebtoken"; // Importing jwt to generate a JWT token for the user after signup
// import session from "cookie-session";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest, // This is a middleware that we created to validate the request body using express-validator
  // If the request body is not valid then it will throw a RequestValidationError which will be caught by the error handler middleware
  async (req: Request, res: Response): Promise<void> => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    // res.status(400).send(errors.array());
    // res.end();
    // This is javascript land but not typescript land
    // const error = new Error("Invalid email (or) password");
    // error.reasons = errors.array();
    // throw error;
    // throw new Error("Invalid email (or) password"); // Whatever error we are throwing from here will be caught
    //  by the error handler middleware which is in error-handler.ts file where we can access it through err.message property.

    // throw new RequestValidationError(errors.array());
    // }

    // if (!email || typeof email !== "string") {
    //   res.status(400).send("Provide a valid email address");
    // }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // console.log("Email is already in use");
      // res.status(400).send({ message: "Email is already in use" });
      // return;
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save(); // This will save the user into the database.
    // After we save the user inside the database, we want to generate a JWT token and set it on the session
    // on the REQ object.

    // Generate the JWT token
    const userJwt = jwt.sign(
      {
        id: user.id, // This is the id of the user that we just created
        email: user.email, // This is the email of the user that we just created
      },
      // "asdf" // This is a secret key that we use to sign the JWT token. In production, this should be an environment variable.
      process.env.JWT_KEY! // To access a environemnt variable with node.js we do process.env.JWT_KEY which is the name of the environment variable
    );
    // Store it on the session object
    (req.session as any) = { jwt: userJwt }; // This is how we set the JWT token on the session object. The session object is created by cookie-session middleware.

    res.status(201).send(user);
  }
);

export { router as signupRouter };
