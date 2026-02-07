import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@mjtickets981/common";
import { stripe } from "../../stripe"; // When we import the stripe module,
// it will use the mocked version defined in src/__mocks__/stripe.ts, which prevents actual API calls to Stripe during testing.

// jest.mock("../../stripe"); // Mock the Stripe module to prevent actual API calls during testing.
// This allows us to simulate the behavior of the Stripe API without making real network requests,
// which can be slow and may have side effects.

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: new mongoose.Types.ObjectId().toHexString(),
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save(); // Save the order to the database.

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: new mongoose.Types.ObjectId().toHexString(),
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save(); // Save the order to the database.

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "assdsdsad",
    })
    .expect(400);
});

it("returns a 201 with a valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save(); // Save the order to the database.

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "valid_token",
    })
    .expect(201);

  const paymentIntentArgs = (stripe.paymentIntents.create as jest.Mock).mock
    .calls[0][0]; // Get the arguments passed to the create method of the mocked Stripe API.

  // Check that the Stripe API was called with the correct parameters.
  // expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
  //   amount: 20 * 100, // Stripe expects the amount in cents, so we multiply by 100.
  //   currency: "usd",
  //   payment_method_types: ["card"],
  // });

  expect(paymentIntentArgs.amount).toEqual(20 * 100); // Check that the amount passed to the Stripe API is correct.
  expect(paymentIntentArgs.currency).toEqual("usd"); // Check that the currency passed to the Stripe API is correct.
  expect(paymentIntentArgs.payment_method_types).toEqual(["card"]); // Check that the payment method types passed to the Stripe API are correct.
});
