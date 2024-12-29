import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, createPhonepeOrder } from '../controllers/users/paymentController.js';

const router = express.Router();

// Routes for Razorpay
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-razorpay-payment', verifyRazorpayPayment);

// Routes for PhonePe
router.post('/create-phonepe-order', createPhonepeOrder);

export default router;
