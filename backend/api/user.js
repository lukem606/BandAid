const express = require("express");
const bcrypt = require("bcryptjs");

const userRouter = express.Router();
const userValidation = require("../middleware/userValidation");

const SALT_ROUNDS = 10;

const registerUser = async (req, res, next) => {
  const { email, password } = req.body.userDetails;

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    req.service.database.createUser({
      email: email,
      password: passwordHash,
    });

    next();
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body.userDetails;

  try {
    const userDetails = req.service.database.getUser(email);
    const result = await bcrypt.compare(password, userDetails.password);

    if (result) {
      next();
    } else {
      throw new Error("Incorrect password");
    }
  } catch (e) {
    res.status(400).json({ error: e });
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

userRouter.use(userValidation);
userRouter.post("/register", registerUser, generateJWT);
userRouter.post("/login", loginUser, generateJWT);

module.exports = {
  userRouter: userRouter,
  registerUser: registerUser,
  loginUser: loginUser,
};
