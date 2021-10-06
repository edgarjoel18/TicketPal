import { Publisher, Subjects, TicketUpdatedEvent } from '@ecticketsrecent/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
