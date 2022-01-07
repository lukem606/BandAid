const express = require("express");
const cors = require("cors");

const eventsRouter = require("./api/events");
const { userRouter } = require("./api/user");
const userAuthentication = require("./middleware/userAuthentication");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use(userAuthentication);
app.use("/events", eventsRouter);

module.exports = app;
