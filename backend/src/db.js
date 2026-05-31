import mongoose from "mongoose";

const Pizza_app_DB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in Render environment");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected to MongoDB Atlas ✅");
  } catch (err) {
    console.log("Failed to connect ❌", err.message);
  }
};

export default Pizza_app_DB;