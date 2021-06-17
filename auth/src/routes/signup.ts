import express, { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { validateRequest, BadRequestError } from "@ecticketsrecent/common";
import { User } from "../models/users";
import jwt from "jsonwebtoken";

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new BadRequestError("Email in use");
    }
    // Hash the password
    // create the user
    const newUser = User.build({ email, password });
    await newUser.save();

    // generate json web token
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );

    // set it as a session on the client's side
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(newUser);
  }
);

export { router as signupRouter };
