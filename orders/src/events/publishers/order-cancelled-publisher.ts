import {
  Publisher,
  OrderedCancelledEvent,
  Subjects,
} from "@ecticketsrecent/common";

export class OrderedCancelledPublisher extends Publisher<OrderedCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
