import express from 'express';
import { createOrder, verifyPayment } from '../controllers/membershipController.js';

const MembershipRouter = express.Router();

MembershipRouter.post('/create-order', createOrder);
MembershipRouter.post('/verify', verifyPayment);

export default MembershipRouter;