const app = require("./server-api");
const port = 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
