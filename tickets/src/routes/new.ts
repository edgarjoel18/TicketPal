import { TicketCreatedPublisher } from "./../../events/publishers/ticket-created-publisher";
import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ecticketsrecent/common";
import { body } from "express-validator";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // With the help of the interfaces typescript knows the attributes needed to create a ticket
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    // save the ticket to mongodb
    await ticket.save();
    // publish an event to nats-streaming server
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTickerRouter };
