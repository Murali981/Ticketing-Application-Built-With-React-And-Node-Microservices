import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

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
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // res.status(400).send(errors.array());
      // res.end();
      // This is javascript land but not typescript land
      // const error = new Error("Invalid email (or) password");
      // error.reasons = errors.array();
      // throw error;
      // throw new Error("Invalid email (or) password"); // Whatever error we are throwing from here will be caught
      //  by the error handler middleware which is in error-handler.ts file where we can access it through err.message property.

      throw new RequestValidationError(errors.array());
    }

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

    res.status(201).send(user);
  }
);

export { router as signupRouter };
