const cors = require("cors");
const express = require("express");

const eventsRouter = require("./events");
const { userRouter } = require("./user");
const dataService = require("../middleware/dataService");
const userAuthentication = require("../middleware/userAuthentication");

const apiRouter = express.Router();

apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use(dataService);

apiRouter.use("/user", userRouter);
apiRouter.use(userAuthentication);
apiRouter.use("/events", eventsRouter);

module.exports = apiRouter;
