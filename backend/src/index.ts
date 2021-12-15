import express from "express";

const app = express();
const port: number = 8080;

app.get("/", (req, res): void => {
  res.send("Hello World!");
});

app.listen(port, (): void => {
  console.log(`Listening at http://localhost:${port}`);
});
