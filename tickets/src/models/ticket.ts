import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  // The goal of this interface is to describe the properties that a Ticket Document has.
  title: string;
  price: number;
  userId: string;
  version: number; // Adding version property to the TicketDoc interface to represent the version number of the document.
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
        (ret as any).id = ret._id;
        delete (ret as any)._id;
      },
    },
  },
);

ticketSchema.set("versionKey", "version"); // Setting the version key to "version" instead of the default "__v"
ticketSchema.plugin(updateIfCurrentPlugin); // Applying the updateIfCurrentPlugin to the schema to handle optimistic concurrency control
// based on the version number. For example if we have a ticket with version 0 and we try to update it to version 1,
// but in the meantime another process has already updated the ticket to version 1, then our update will fail because
// the version number is not matching.

ticketSchema.statics.build = (attr: TicketAttrs) => {
  return new Ticket(attr);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
