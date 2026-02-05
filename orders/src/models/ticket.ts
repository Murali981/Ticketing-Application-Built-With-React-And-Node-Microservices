import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>; // This method will check if the ticket is already reserved or not.
  // Why are we returning a Promise here? Because this method is going to be an async method. It is going to
  // make a call to the database to check if there is an existing order associated with this ticket.
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>; // This is a custom static method that we are adding to the Ticket model.
  // This method will be used to find a ticket by its id and version. What we will do is we will find a ticket
  // whose version is one less than the version that we are looking for. This is because when we receive an event
  // that a ticket has been updated, we want to make sure that we are updating the correct version of the ticket.
  // Why we are returning a Promise here? Because this method is going to be an async method. It is going to
  // make a call to the database to find the ticket.
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

ticketSchema.set("versionKey", "version"); // Here we are telling mongoose to use the version field instead of the default __v field to track the version of the document.
ticketSchema.plugin(updateIfCurrentPlugin); // This plugin will automatically increment the version number of the document whenever it is updated.

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
}; // Here we are defining the static method 'findByEvent' on the ticketSchema.
// This method will be used to find a ticket by its id and version. What we will do is we will find a ticket
// whose version is one less than the version that we are looking for. This is because when we receive an event
// that a ticket has been updated, we want to make sure that we are updating the correct version of the ticket.
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, // We are setting the _id field to attrs.id because we want to use the same id that we get from the event.
    title: attrs.title,
    price: attrs.price,
  });
}; // The statics object (or) property is used to add static methods to the model. With the help of
// statics we can define our own custom static methods on the model. We can directly add the method on the ticket model itself.

ticketSchema.methods.isReserved = async function () {
  // Why we have to use a keyword "function"
  // here instead of an arrow function? Because we need to use the "this" keyword inside this method.
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    // Here we are querying the orders collection to find an order that is associated with this ticket and
    // is not cancelled. The below query is doing exactly that by using the $in operator to check if the status of the order is one of
    // the following values: Created, AwaitingPayment, Complete.
    ticket: this, // Here we are setting the ticket field to this which is the ticket document that we just called 'isReserved' on.
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ], // Here we are checking if the status of the order is one of the following values: Created, AwaitingPayment, Complete.
    },
  });

  return !!existingOrder; // If we find an existing order then that means that the ticket is already reserved.
  // this === the ticket document that we just called 'isReserved' on
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket }; // we throw an error. This is to ensure that we do not try to use the NATS client before it has been properly connected.
// If it is defined we simply return it.// Here we are exporting the Ticket model so that it can be used in other parts of the application.
