import Razorpay from 'razorpay';
import crypto from 'crypto';
import UserModel from '../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { amount, membership } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `membership_${Date.now()}`,
      notes: { membership }
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, membership } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }
await UserModel.findOneAndUpdate({ uid: userId }, { membership });
    res.status(200).json({ message: "Payment verified!", membership });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};