/**
 * Note: A subject in nats-streaming is a channel recieving events in the nats-streaming bus
 */
/**
 * enum created to reduce typos when assigning a value to subject and data in our listeners
 */
export enum Subjects {
  TicketCreated = "ticket:created",
  OrderUpdated = "order:updated",
}
