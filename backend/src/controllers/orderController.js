import { orderModel } from '../models/Order.js';
import Cart from '../models/Cart.js';

export const Order = async (req, res) => {
  try {
    const { cart, total, userId, address } = req.body;
    const newOrder = new orderModel({
      userId, orderDetails: cart, price: total,
      status: "Pending", address
    });
    await newOrder.save();
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
    res.status(201).json({ message: "Order placed!", order: newOrder });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error while placing order" });
  }
};

export const Show_orders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};
export const Get_all_orders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching all orders" });
  }
};
export const Update_order_status = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Preparing", "On the Way", "Delivered"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const updated = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating status" });
  }
};