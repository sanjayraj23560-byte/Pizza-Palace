import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from "express";
import cors from "cors";
import Pizza_app_DB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import Pizza_router from "./routes/pizzaRoutes.js";
import Order_Router from "./routes/orderRoutes.js";
import CartRouter from "./routes/cartRoutes.js";
import DrinkRouter from "./routes/drinkRouter.js";
import MembershipRouter from './routes/membershipRoutes.js';

const app = express();

app.use(cors({
  origin: [
    "https://your-app.vercel.app", // add after vercel deploy
    "http://localhost:5173"
  ]
}))
app.use(express.json());

Pizza_app_DB();
app.use("/api/order", Order_Router);
app.use("/api/cart", CartRouter)
app.use("/api/drink", DrinkRouter);
app.use("/api/pizza", Pizza_router);
app.use("/api/users", userRoutes);
app.use('/api/membership', MembershipRouter);
app.get("/", (req, res) => {
  res.send("PizzaPalace API is running! 🍕");
});

const PORT = 5000;
app.listen(PORT, () => {
});