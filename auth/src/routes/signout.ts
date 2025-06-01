import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // What is it really mean to sign out a user ?
  // We are essentially going to send back a header that is going to tell the user's browser to dump all the information which is
  // inside the cookie. Just empty it out. This means that if the user makes any follow-up request then there will be no token
  // included inside this cookie. To empty out all the user's information inside the user's cookie we are going to use the
  // cookie-session library once again.
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
