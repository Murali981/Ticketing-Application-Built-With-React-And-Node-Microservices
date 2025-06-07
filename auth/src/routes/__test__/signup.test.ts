import request from "supertest"; // supertest is the thing that is going to allow us to fake a request to the express application.
import { app } from "../../app"; // This is going to import the express application that we created in app.ts file.

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "aasasxas",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "aasasxas",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ password: "askjsdsdffdf" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app) // After making this request we need to somehow inspects the response that comes back from it.
    // It turns out that when we make a request with supertest, It will return a response back and that returned response we are storing
    // it in a variable called response. This is the same kind of response object that we will get access inside of our request handlers.
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined(); // Here get is the method that is built into the response that allows us to look up any of the headers that
  // has been set on the response. The header that we are trying to look up is "Set-Cookie"
});
