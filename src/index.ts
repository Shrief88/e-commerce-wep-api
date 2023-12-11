import express from "express";
import env from "./utils/validateEnv";
import morgan from "morgan";

const port = env.PORT;

const app = express();

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Express app is listening on: http://localhost:${port}`);
});
