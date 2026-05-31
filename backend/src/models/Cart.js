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

// This is the blueprint for the entire Cart belonging to a specific User
const UserCartSchema = new mongoose.Schema({
    // We strictly tie the cart to the user who is logged in!
    userId: { type: String, required: true },
    items: [CartSchema], // An array of the items above
}, { timestamps: true });

const Cart = mongoose.model("Cart", UserCartSchema);
export default Cart;