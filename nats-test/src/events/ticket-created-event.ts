import { Subjects } from "./subjects";

/**
 * Creating a tight coupling between the channel name and an event's data
 * these are the properties we expect have in our data when we create a listener
 */
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
