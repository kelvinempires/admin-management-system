import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.log("Error while connecting to database", error);
  }
};
export default dbConnection;
