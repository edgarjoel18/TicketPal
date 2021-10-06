import { listener, OrderCreatedEvent, Subjects } from "@ecticketsrecent/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';
import {TicketUpdatePublisher} from '../ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

 async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
      // reach into the ticket collection and find the ticket that the order is reserving
      const ticket = await Ticket.findById(data.ticket.id);
      // If there is not ticket throw an error
      if(!ticket){
        throw new Error('Ticket not found');
      }
      // Mark the ticket as being reserved by setting the order Id property
      ticket.set({orderId: data.id});

      // save the ticket
      await ticket.save();
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version,
      });

      // ack the ticket
      msg.ack();
  }

}
