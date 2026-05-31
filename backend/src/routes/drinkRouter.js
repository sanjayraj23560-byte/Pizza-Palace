import express from 'express';
import { getAllDrinks } from '../controllers/drinkController.js';

const DrinkRouter = express.Router();

DrinkRouter.get('/',getAllDrinks);

export default DrinkRouter