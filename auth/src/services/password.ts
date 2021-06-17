import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

/* scrypt is callback based. Here we are making it promised based. */
const scryptAsync = promisify(scrypt);

/**
 * Password class used to encrypt passwords before saving them to mongodb.
 */
export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buff.toString("hex")}.${salt}`; // buff and salt are concatenated
  }

  /**
   * compare() used to compare the password given in the request from the client to the
   * password saved in mongodb
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buff.toString("hex") === hashedPassword;
  }
}
