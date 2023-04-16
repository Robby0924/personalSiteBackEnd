const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const { createUser, getUserById, updateUser, getUser } = require("../db");

usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      return next({
        name: "MissingCredentialsError",
        message: "Supply both an email and password.",
        error: "MissingCredentialsError",
      });
    }

    const user = await getUser({ email, password });
    if (user) {
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({ message: `Welcome back, ${user.first_name}!`, token, user });
      return token;
    } else {
      res.status(403);
      return next({
        name: "IncorrectCredentialsError",
        message: "Email or password is incorrect.",
        error: "IncorrectCredentialsError",
      });
    }
  } catch (error) {
    throw error;
  }
});
