import dotenv from 'dotenv'
dotenv.config()

import mongoose from "mongoose";

import Pizza_app_DB from "./db.js";

import Pizza from "./models/Pizza.js";
import pizzas from "./data/pizzaData.js";

import Drink from "./models/Drink.js";
import drinks from "./data/drinkData.js";

const seedDatabase = async () => {
    try {
        await Pizza_app_DB();
        await Pizza.deleteMany();
        console.log("Old menu cleared!");
        await Drink.deleteMany();
        console.log("Old menu cleared!");
        await Pizza.insertMany(pizzas);
        console.log("Database Seeded Successfully! 🍕");
        await Drink.insertMany(drinks);
        console.log("Drinks are updated!..");
        process.exit();
    } catch (error) {
        console.log("Error seeding database: ", error);
        process.exit(1);
    }
};
seedDatabase();