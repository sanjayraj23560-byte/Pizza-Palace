import Pizza from "../models/Pizza.js";

export const getAllPizzas = async (req, res) => {
    try {
        console.log("Fetching the menu...");
        const pizzas = await Pizza.find({}); 
        res.json(pizzas);
        
    } catch (error) {
        console.log("Error fetching pizzas:", error);
        res.status(500).json({ message: "Server crashed while fetching the menu" });
    }
};