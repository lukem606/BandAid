const express = require("express");

const apiRouter = require("./api/api");

const app = express();
const port = process.env.PORT || 8080;

app.use(apiRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
