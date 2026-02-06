import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current"; // Import the plugin for optimistic concurrency control
import { OrderStatus } from "@mjtickets981/common";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
} // Define the attributes required to create a new Order

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
} // Define the properties that an Order document will have

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
} // Define the properties that the Order model will have (e.g., static methods)

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.set("versionKey", "version"); // Use 'version' instead of '__v' for versioning
orderSchema.plugin(updateIfCurrentPlugin); // Apply the plugin to the schema for optimistic concurrency control

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
  });
}; // Add a static method to the schema to create new Orders

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema); // Create the Order model

export { Order };
