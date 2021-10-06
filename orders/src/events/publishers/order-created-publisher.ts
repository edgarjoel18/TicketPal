import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@ecticketsrecent/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
