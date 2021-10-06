import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from "@ecticketsrecent/common";
import { Ticket } from "../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // Find the ticket being updated
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket Not found");
    }

    const { title, price } = data;

    // Update the ticket
    ticket.set({ title, price });
    await ticket.save();

    // Notify Nats-Streaming server that we have succesfully processed the ticket
    msg.ack();
  }
}
