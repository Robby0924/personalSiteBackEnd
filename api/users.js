const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const {
  createUser,
  getUserById,
  updateUser,
  getUserByEmail,
  getUser,
} = require("../db");

//POST /api/users/login-----------------------------------------------------
usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      return next({
        name: "MissingCredentialsError",
        message: "Please supply both an email and password.",
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


//POST /api/users/register-----------------------------------------------------
usersRouter.post("/register", async (req, res, next) => {
  const { first_name, last_name, password, email } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(409);
      return next({
        name: "UserExistsError",
        message: `User with email ${email} is already taken.`,
        error: "UserExistsError",
      });
    }
    if (password.length < 8) {
      res.status(400);
      return next({
        name: "PasswordError",
        message: "Password must be 8 characters or more.",
        error: "PasswordError",
      });
    }

    const user = await createUser({
      first_name,
      last_name,
      password,
      email,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email,
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    const _user = await getUserByEmail(email);

    if (_user) {
      res.send({
        message: `Hey ${_user.first_name}! Thanks for signing up!`,
        token,
        user,
      });
    } else {
      res.status(400);
      return next({
        name: "UserRegisterError",
        message: "Registration failed.",
        error: "UserRegisterError",
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = usersRouter;
