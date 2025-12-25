import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  // We will only find the orders for the user who is making this request
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin(); // We can make either requests as user one (or) user two
  const userTwo = global.signin();
  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id }) // We have successfully reserver the ticket one for the userOne
    .expect(201);
  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id }) // We have successfully reserver the ticket two for the userTwo
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id }) // We have successfully reserver the ticket three for the userTwo
    .expect(201);
  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo) // We are making the request as userTwo
    .expect(200);
  // Make sure we only get the orders for User #2
  //   console.log(response.body);
  expect(response.body.length).toEqual(2); // This is going to make sure that we have only 2 orders for the userTwo
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
