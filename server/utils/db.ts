import "dotenv/config";
import mongoose from "mongoose";
import { getErrorMessage } from "./ErrorHandler";

const dbUrl: string = process.env.DB_URL ?? "";

const connectDB = async () => {
  try {
    const data = await mongoose.connect(dbUrl);
    console.log(`Database connected with ${data.connection.host}`);
  } catch (error: unknown) {
    console.log(getErrorMessage(error));

    setTimeout(() => {
      void connectDB();
    }, 5000);
  }
};

export default connectDB;
