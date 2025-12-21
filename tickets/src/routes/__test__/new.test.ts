import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natswrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({}); // empty object to avoid validation errors
  expect(response.status).not.toEqual(404);
});

it("It can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({}); // empty object to avoid validation errors

  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin()) // We are setting the cookie header to the value returned by the global.signin() function.
    .send({}); // empty object to avoid validation errors
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 }) // Invalid title
    .expect(400); // We are expecting a 400 status code because the title is invalid.

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ price: 10 }) // Missing title
    .expect(400); // We are expecting a 400 status code because the title is missing.
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "Valid Title", price: -10 }) // Invalid price
    .expect(400); // We are expecting a 400 status code because the price is invalid.

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "Valid Title" }) // Missing price
    .expect(400); // We are expecting a 400 status code because the price is missing.
});

it("creates a ticket with valid inputs", async () => {
  // add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({}); // This query is going to give all the tickets that exists inside the collection.
  expect(tickets.length).toEqual(0);

  const title = "Things";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "Things";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  console.log(natswrapper);

  expect(natswrapper.client.publish).toHaveBeenCalled(); // Here we are checking if the publish method on the natsWrapper.client object was called or not.
});
