import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';
import {Order} from './orders';

/* This file is specific to the database required in the orders service */
interface TicketAttributes {
    id: string;
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: string;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes): TicketDoc;
    findByEvent(event: {
        id: string,
        version: number
    }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionkey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        id: event.id,
        version: event.version - 1
    });
}

// Adding a method to the ticketModel
ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price
    });
}

// A function to check if a ticket has been reserved
ticketSchema.methods.isReserved = aync function() {
    // this === the ticket document that we just called "isReserved" on 
    const exisitingOrder = await Order.findOne({
      ticket: this,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    return !!exisitingOrder;
};





const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };


