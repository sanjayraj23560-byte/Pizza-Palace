import express from 'express';
import { Order, Show_orders, Update_order_status, Get_all_orders } from '../controllers/orderController.js';

const Order_Router = express.Router();

Order_Router.post('/', Order);
Order_Router.get('/all', Get_all_orders);        
Order_Router.get('/:userId', Show_orders);
Order_Router.patch('/:orderId/status', Update_order_status); 

export default Order_Router;