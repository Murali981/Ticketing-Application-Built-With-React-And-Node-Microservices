import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt); // promisify is used to convert callback-based functions to return promises

export class Password {
  static async toHash(password: string) {
    // Static methods are the methods that we can access without creating an instance of the class.
    // We can access the static methods using the class name itself.
    // For example, Password.toHash() instead of creating an instance of the class Password.

    const salt = randomBytes(8).toString("hex"); // 8 bytes of random data
    // randomBytes(8) will return a buffer of 8 bytes of random data.
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; // scrypt is a password hashing function
    // scryptAsync is a promisified version of scrypt which returns a promise.

    return `${buf.toString("hex")}.${salt}`; // buf.toString("hex") will return the buffer as a hex string.
    // salt is used to make the password hashing more secure.
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split("."); // split the stored password into hashed password and salt
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // hash the supplied password with the same salt

    return buf.toString("hex") === hashedPassword; // compare the hashed password with the stored password
  }
}
