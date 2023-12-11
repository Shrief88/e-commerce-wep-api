import app from "./app";
import mongoose from "mongoose";
import env from "./utils/validateEnv";

const port = env.PORT;
const connectionString = env.MONGO_URI;

const main = async (): Promise<void> => {
  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.log(`${err}: did not connect`);
  }
};

void main();
