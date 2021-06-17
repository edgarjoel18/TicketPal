import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@ecticketsrecent/common";
import { Ticket } from "../../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must be provided"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // retrieve the ticket
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // currentUser owns the ticket
    // set() updates our model in-memory
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    // save the updated ticket to mongo
    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
