import express from 'express';
import { Signup, Login, AdminLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/admin-login', AdminLogin); 

export default router;