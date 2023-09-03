import express from "express";
import authController from "../controllers/auth";

const auth = express.Router();

auth.post("/register", authController.registerUser);
auth.post("/login", authController.loginUser);
auth.get("/logout", authController.logoutUser);
auth.get("/protected", function (req, res) {
  res.status(200).json({ message: "Protected Route", user: req.user });
});

export default auth;
