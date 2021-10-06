import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@ecticketsrecent/common";
import { Ticket } from "../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], message: Message) {
    // remember from our business requirements we wanted to and orders service to save a ticket
    // with a title and a price
    const { title, price, id } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
