import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// ValidationError is a type that comes back whenever we do a validation attempt using express-validator
// The type refers has contains properties like msg, param, field etc....

// interface CustomError {
//   statusCode: number;
//   serializeErrors(): { message: string; field?: string }[]; // This is going to return an array of objects and each of these
//   // objects should have a message which is of type string and a field which is optional. Our custom class will satisify the
//   // above interface by writing the implements the CustomError interface as below.
// }

// export class RequestValidationError extends Error {
//   // implements CustomError
//   statusCode = 400;
//   constructor(public errors: ValidationError[]) {
//     super();

//     // Only because we are extending a built in class
//     Object.setPrototypeOf(this, RequestValidationError.prototype);
//   }

//   serializeErrors() {
//     return this.errors
//       .map((err) => {
//         if (err.type === "field") {
//           return { message: err.msg, field: err.path };
//         }
//       })
//       .filter((error) => error !== undefined);
//   }
// }

export class RequestValidationError extends CustomError {
  // implements CustomError
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors
      .map((err) => {
        if (err.type === "field") {
          return { message: err.msg, field: err.path };
        }
      })
      .filter((error) => error !== undefined);
  }
}
