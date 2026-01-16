import mongoose from "mongoose";
import { OrderStatus } from "@mjtickets981/common";
import { TicketDoc } from "./ticket";

export { OrderStatus }; // Re-exporting the OrderStatus enum so that other files can use it.

interface OrderAttrs {
  // These properties are required to create a new Order
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  // These properties exist on an Order document
  userId: string; // Here we are defining the userId property which is of type String.
  // Since we are extending mongoose.Document Mongoose is going to automatically
  // add the id property to this OrderDoc interface. So we don't need to define it here.
  // This is not javascript object where we are defining the different properties of this userId field.
  // This is just a typescript type annotation. That is the reason we are using colon (:) here instead of
  // defining an object with different properties. So this is just a typescript type annotation. So string is a typescript type.
  // But in the above userId field in the orderSchema we are defining an actual javascript object where we are defining
  // the different properties of this userId field.
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// Let us build our schema now which actually describes the different properties and some rules about them that we are
// going to enforce at the MongoDB level.

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Here we are defining the userId property which is of type String and it is required.
      // And also this is actual javascript object where we are defining the different properties of this userId field.
      // This is not just a typescript type annotation. but this is actual javascript object that Mongoose is going to use
      // to enforce the schema at the MongoDB level.
      required: true,
    },
    status: {
      type: String,
      required: true,
      //   enum: ["created", "cancelled", "awaiting:payment", "complete"], // Here we are defining the different possible values for the status field.
      enum: Object.values(OrderStatus), // Here we are using the OrderStatus enum that we imported from the common package to define the different possible values for the status field.
      default: OrderStatus.Created, // Here we are setting the default value of the status field to "created".
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket", // Here we are setting up a reference to the Ticket model. This is how we create a relationship between two different collections in MongoDB.
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret as any).id = ret._id; // Here we are adding an id property to the returned JSON object and setting it to the value of _id.
        // This is a transformation function that modifies the JSON representation of the document.
        delete (ret as any)._id; // Here we are deleting the _id property from the returned JSON object. This is because we want to use id instead of _id.
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  // Here we are adding a static method called build to the orderSchema.
  // This method takes an object of type OrderAttrs as an argument and returns a new Order document.
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
