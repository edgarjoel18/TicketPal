import { NotFoundError } from "@ecticketsrecent/common";
import express, { Request, Response } from "express";
import { Ticket } from "../../models/ticket";
const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  // if ticket is not found return 404. ticket will have value TicketDoc or null
  // findById() is used to query a ticket from the db using the currentUser.id;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
