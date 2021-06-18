import { natsWrapper } from "../nats-wrapper";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@ecticketsrecent/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-update-publisher";
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
    // publish the event to nats-streaming server
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
