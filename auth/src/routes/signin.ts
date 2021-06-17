// import { RequestValidationError } from "../errors/request-validation-error";
import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validateRequest, BadRequestError } from "@ecticketsrecent/common";
import { User } from "../models/users";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

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
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("Hello from signin");
    const { email, password } = req.body;
    // reach out to mongodb and check if the user exists
    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordsMatch = await Password.compare(
      exisitingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }
    // User is now logged in
    // generate json web token
    const userJwt = jwt.sign(
      {
        id: exisitingUser.id,
        email: exisitingUser.email,
      },
      process.env.JWT_KEY!
    );

    // set it as a session on the client's side
    req.session = {
      jwt: userJwt,
    };
    res.status(200).send(exisitingUser);
  }
);

export { router as signinRouter };
