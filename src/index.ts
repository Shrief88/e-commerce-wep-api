import dbConnection from "./config/dbConnection";
import env from "./validators/validateEnv";
import app from "./app";

void dbConnection();

const port = env.PORT;
const server = app.listen(port, () => {
  console.log(`Express app is listening on: http://localhost:${port}`);
});

interface Error {
  name: string;
  message: string;
}

// HANDLE REJECTION OUTSIDE EXPRESS
process.on("unhandledRejection", (err: Error) => {
  console.log(`unhandledRejection error : ${err.name} : ${err.message}`);
  server.close(() => {
    console.log("Shutting down server...");
    process.exit(1);
  });
});
