import "dotenv/config";
import mongoose from "mongoose";
import { getErrorMessage } from "./ErrorHandler";

let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Establishes and caches a MongoDB connection for both persistent and serverless runtimes.
 */
const connectDB = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    return mongoose;
  }

  const dbUrl = process.env.DB_URL ?? "";
  if (!dbUrl) {
    throw new Error("DB_URL environment variable is not defined");
  }

  connectionPromise ??= mongoose
    .connect(dbUrl, { serverSelectionTimeoutMS: 5000 })
    .then((data) => {
      console.log(`Database connected with ${data.connection.host}`);
      return data;
    })
    .catch((error: unknown) => {
      connectionPromise = null;
      console.log(getErrorMessage(error));
      throw error;
    });

  return connectionPromise;
};

export default connectDB;
