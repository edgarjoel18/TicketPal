import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
/**
 * TicketCreatedListener is defined for the payments service
 */

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // Reduced hardcoding the channel we are listening to which could of raised many typo errors
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  /*
   * onMessage can now be implemented for any business logic.
   * @param data: Enforces typescript to do typechecking on the properties we try to access from
   * data. Also reduces accessing properties that don't exist from our data.
   */
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data: ", data);

    // If any of these conditions are met. We don't acknowledge the message
    // and send it back to Nats
    console.log(data.id + " " + data.title + " " + data.price);

    // message successful
    msg.ack();
  } // End of onMessage
} // End of TicketCreatedListener
