const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");

const eventsRouter = require("./events");
const { userRouter } = require("./users");
const dataService = require("../middleware/dataService");
const userAuthentication = require("../middleware/userAuthentication");

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use(dataService);

apiRouter.use("/users", userRouter);
apiRouter.use(userAuthentication);
apiRouter.use("/events", eventsRouter);

module.exports = apiRouter;
