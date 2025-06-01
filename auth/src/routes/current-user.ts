import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  // if (!req.session?.jwt) {
  //   // If the jwt property is not set then it means that the user is not logged in
  //   res.send({ currentUser: null });
  //   return;
  // }
  // try {
  //   const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
  //   res.send({ currentUser: payload });
  // } catch (err) {
  //   // With the help of verify() method only we can extract the information (or) payload from the JsonWebToken
  //   // If the jwt is valid, we can return the current user.
  //   res.send({ currentUser: null });
  // }
  // We have to take the information which is present on the currentUser property which is on the request object.
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
