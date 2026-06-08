import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId: { type: String, required: true },
  orderDetails: { type: Array, required: true },
  price: Number,
  status: { type: String, default: "Pending" },
  picture: String,
  address: {           
    name: String,
    phone: String,
    street: String,
    city: String,
    pincode: String
  }
}, { timestamps: true }); 

export const orderModel = mongoose.model("orders", orderSchema);