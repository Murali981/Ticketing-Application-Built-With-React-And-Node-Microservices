import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator"; // This body is a method which can be used as a middleware to validate the
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken"; // Importing jwt to generate a JWT token for the user after signin
// We are going to use this jwt to sign the user object and then we are going to set it on the session object.
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
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      // If the user does not exist then we want to throw a BadRequestError
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      // If the passwords do not match then we want to throw a BadRequestError
      throw new BadRequestError("Invalid credentials");
    }

    // Generate the JWT token
    const userJwt = jwt.sign(
      {
        id: existingUser.id, // This is the id of the user that we just created
        email: existingUser.email, // This is the email of the user that we just created
      },
      // "asdf" // This is a secret key that we use to sign the JWT token. In production, this should be an environment variable.
      process.env.JWT_KEY! // To access a environemnt variable with node.js we do process.env.JWT_KEY which is the name of the environment variable
    );
    // Store it on the session object
    (req.session as any) = { jwt: userJwt }; // This is how we set the JWT token on the session object. The session object is created by cookie-session middleware.

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
