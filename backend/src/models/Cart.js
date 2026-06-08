import mongoose from "mongoose";

// This is the blueprint for a single item inside the cart
const CartSchema = new mongoose.Schema({
    productId: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    img: { 
        type: String 
    },
    quantity: { 
        type: Number, 
        default: 1,
        min: 1 
    }
});

const UserCartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [CartSchema],
}, { timestamps: true });

const Cart = mongoose.model("Cart", UserCartSchema);
export default Cart;