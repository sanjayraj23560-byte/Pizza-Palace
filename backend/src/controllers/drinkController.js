import Drink from "../models/Drink.js";

export const getAllDrinks = async (req, res) => {
    try {
        console.log("Fetching the menu...");
        const drinks = await Drink.find({}); 
        res.json(drinks);
        
    } catch (error) {
        console.log("Error fetching Drinks:", error);
        res.status(500).json({ message: "Server crashed while fetching the menu" });
    }
};
