import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        img: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Pizza = mongoose.model("Pizza", pizzaSchema);
export default Pizza;