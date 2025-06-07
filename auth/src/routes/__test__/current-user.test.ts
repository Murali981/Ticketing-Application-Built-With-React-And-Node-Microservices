import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  // To test this, we have to first create a new account by signing up and then make a request to the current user end point.

  const cookie = await global.signin();
  //   const authResponse = await request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       email: "test@test.com",
  //       password: "password",
  //     })
  //     .expect(201); // We will capture the cookie that is sent back in this initial request and then include this cookie in the
  //   // follow up request to the current user endpoint.

  //   const cookie = authResponse.get("Set-Cookie"); // Here we are getting the cookie that is sent back in the response
  //   // from the signup request. This cookie contains the session information for the user that we just signed up.

  //   // After signing up successfully, we can make a follow up request to the current user endpoint.

  //   if (!cookie) {
  //     throw new Error("Cookie not set after signup");
  //   }

  const response = await request(app) // Information about the current user shoould be on the response body. So we can refer to
    // the response.body where the information about the current user is stored.
    .get("/api/users/currentuser")
    .set("Cookie", cookie) // Here we are setting the cookie that we received from the signup request in the follow up request
    // to the current user endpoint. This is how we can include the cookie in the request. set() method is used to set different
    // headers on the request
    .send()
    .expect(200);

  console.log(response.body); // Here it logs the current user as null. Why here it is logging the current user as null?
  // Because in the above request we are first signing up as a new user we have to be authenticated. So why are we not seeing
  // some current user coming back in the response body when we make the request to the current user. The issue here is, We are
  // working in the browser and also we are working with the postman to test out all these different route handlers. The browser
  // and the postman have some functionality included inside them to automatically manage the cookies and send the cookie data
  // along with any follow up request to our server. We are currently making use of the supertest library to make requests inside our
  // testing setup environment. supertest does not automatically manage cookies for us. So we have to manually tell supertest to
  // include the cookie that we received from the signup request in the follow up request to the current user endpoint. Eventhough
  // we get back a cookie from the first signup request then it does not get sent automatically along with the second follow up request
  // to the current user endpoint. So we have to manually include the cookie that we received from the first request in the second request
  // to the current user endpoint. So we can do that by using the set method on the supertest request object. The set method allows us // to set any header that we want on the request. So we can set the cookie header on the request and then pass in the cookie that we
  // received from the first request. So we can do that by using the get method on the response object to get the cookie that we received.

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
