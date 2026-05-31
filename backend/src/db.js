import mongoose from "mongoose";

const Pizza_app_DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB Atlas ✅")
  } catch (error) {
    console.log("Failed to connect ❌", error.message)
  }
}

export default Pizza_app_DB