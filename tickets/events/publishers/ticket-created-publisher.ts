import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@ecticketsrecent/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
