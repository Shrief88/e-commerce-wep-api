import express from "express";
import env from "./utils/validateEnv";
import morgan from "morgan";

const app = express();

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
