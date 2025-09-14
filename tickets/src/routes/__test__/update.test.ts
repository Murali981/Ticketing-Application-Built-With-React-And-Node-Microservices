import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("It returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // This is a function to generate a valid mongo object id.
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(404);
});

it("It returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // This is a function to generate a valid mongo object id.
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(401);
});

it("It returns a 401 if the user does not own the ticket", async () => {
  // Here we are going to crearte a ticket
  // and then update it with a different user which returns a status code of 401
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      price: 20,
    }) // When we actually create this ticket then the ticket is going to have the userId which is equal to the userId
    // that we have extracted from the cookie that we include.
    .expect(201);

  // In the below we are making a follow up request where we are going to use the same exact cookie where it is going to
  // have the same userId there. We have exactly one userId which is floating around the application.
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin()) // This is another user who is trying to update the ticket which is not created by him.
    .send({
      title: "asdasdasdasd",
      price: 1000,
    })
    .expect(401);
});

it("It returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400); // Invalid title

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({}) // Both title and price are missing
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "valid title",
      price: -10,
    })
    .expect(400); // Invalid price
});

it("It updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});
