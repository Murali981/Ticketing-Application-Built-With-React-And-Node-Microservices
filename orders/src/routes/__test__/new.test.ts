import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId(); // This is going to generate a new valid random MongoDB ObjectId
  await request(app)
    .post("/api/orders") // Here we are making a request to create a new order
    .set("Cookie", global.signin()) // Here we are setting the cookie to simulate an authenticated user
    .send({ ticketId }) // Here we are sending the ticketId in the request body
    .expect(404); // Here we are expecting a 404 Not Found error because the ticket does not exist
});

it("returns an error if the ticket is already reserved", async () => {
  // Inorder to do a little bit setup for this test, we need to first create a ticket and save it to the database.
  // Then we need to create an order for that ticket and save it to the database and make sure that the order and the ticket
  // are associated with each other. Then  we will finally make the request
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "asdasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post("/api/orders") // Here we are making a request to create a new order
    .set("Cookie", global.signin()) // Here we are setting the cookie to simulate an authenticated user
    .send({ ticketId: ticket.id }) // Here we are sending the ticketId in the request body
    .expect(400); // Here we are expecting a 400 Bad Request error because the ticket is already reserved
});

it("reserves a ticket", async () => {
  // We make sure that a ticket is inside the database which is free and not reserved by any other order.
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders") // Here we are making a request to create a new order
    .set("Cookie", global.signin()) // Here we are setting the cookie to simulate an authenticated user
    .send({ ticketId: ticket.id }) // Here we are sending the ticketId in the request body
    .expect(201); // Here we are expecting a 201 Created response because the ticket is available and not reserved
});

it.todo("emits an order created event");
