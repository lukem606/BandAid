const express = require("express");
const bcrypt = require("bcryptjs");

const userRouter = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../middleware/userValidation");

const SALT_ROUNDS = 10;

const registerUser = async (req, res, next) => {
  const { email, password } = req.body.userDetails;

  try {
    const userDetails = await req.service.database.getUser(email);

    if (userDetails) {
      throw new Error("This email address is already registered");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await req.service.database.createUser({
      email: email,
      password: passwordHash,
    });

    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body.userDetails;

  try {
    const userDetails = await req.service.database.getUser(email);

    if (userDetails) {
      const result = await bcrypt.compare(password, userDetails.password);

      if (result) {
        next();
      } else {
        throw new Error("Incorrect password");
      }
    } else {
      throw new Error("Email address is not registered");
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const generateJWT = (req, res) => {
  res
    .set({
      "access-token": "token",
    })
    .status(200)
    .json({ ham: "cheese balls" });
};

userRouter.post("/register", registerValidation, registerUser, generateJWT);
userRouter.post("/login", loginValidation, loginUser, generateJWT);

module.exports = {
  userRouter: userRouter,
  registerUser: registerUser,
  loginUser: loginUser,
};
