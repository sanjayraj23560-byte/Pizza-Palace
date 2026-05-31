import express from 'express';
import { AddCart, ShowCart, RemoveFromCart } from '../controllers/cartController.js';

const CartRouter = express.Router();

CartRouter.post('/add', AddCart);
CartRouter.post('/remove', RemoveFromCart); // ✅ NEW
CartRouter.get('/:userId', ShowCart);

export default CartRouter;