import "dotenv/config";
import http from "node:http";
import { app } from "./app";
import connectDB from "./utils/db";
import { initSocketServer } from "./socketServer";

const connectWithRetry = () => {
  void connectDB().catch(() => {
    setTimeout(connectWithRetry, 5000);
  });
};

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  connectWithRetry();
});

initSocketServer(server);
