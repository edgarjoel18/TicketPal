import {Listener, OrderCancelledEvent, Subjects} from '@ecticketsrecent/common';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';
import {TicketUpdatedPublisher} from '../ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        // reach into the ticket collection and find the ticket that the order is reserving
      const ticket = await Ticket.findById(data.ticket.id);
      // If there is not ticket throw an error
      if(!ticket){
        throw new Error('Ticket not found');
      }
      // Mark the ticket as being reserved by setting the order Id property
      ticket.set({orderId: undefined });
      await ticket.save();
      await new TicketUpdatedPublisher(this.client).publish({
          id: ticket.id,
          orderId: ticket.orderId,
          userId: ticket.userId,
          price: ticket.price,
          version: ticket.version
      });

      msg.ack();
    }

}






