import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("it marks an order as cancelled", async () => {
  // We are going to create a ticket with the ticket model
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin(); // from the global signin helper
  // Make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send() // no body needed because we are just deleting
    .expect(204);
  // expect the order is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled); // Why we put ! here? Because we are sure that updatedOrder is not null
  // we put ! to tell typescript that we are sure that updatedOrder is not null
});

it.todo("emits a order cancelled event");
