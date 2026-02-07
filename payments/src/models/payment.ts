import mongoose from "mongoose";

// Inside the payment object we are going to just store the ID of the order
// and the stripe charge ID that we get back from stripe when we create a charge
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        // here doc is the mongoose document and ret is the object that will be returned when we convert the document to JSON
        ret.id = ret._id; // we want to rename _id to id because that's what we are used to working with in our codebase
        delete ret._id; // we want to delete the _id field because we don't need it anymore
      },
    },
  },
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema,
);

export { Payment };
