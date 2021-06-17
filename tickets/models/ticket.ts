import mongoose from "mongoose";

// Defining the Ticket attributes
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// Defining a Ticket Document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
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
    },
    userId: {
      type: String,
      required: true,
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
// ret is the object about to turn into json

ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Title", ticketSchema);

export { Ticket };
