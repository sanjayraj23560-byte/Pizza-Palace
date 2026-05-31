import mongoose from "mongoose";

const DrinkSchema = new mongoose.Schema(
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

const Drink = mongoose.model("Drink", DrinkSchema);
export default Drink;