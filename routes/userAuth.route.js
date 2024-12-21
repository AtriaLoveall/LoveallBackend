// authRoute.js
import { Router } from 'express';
import register from '../controllers/users/registerController.js';
import verifyOtp from '../controllers/users/verifyOtpController.js'
import forgetPassword from '../controllers/forgetPassword.controller.js';
import sendOTP from '../controllers/sendOTP.controller.js';
import login from '../controllers/login.controller.js';

const router = Router(); // Instantiate the Router

// Define the route and associate it with the controller
router.post('/register', register);      // Register route
router.post('/login', login)
router.post('/forget-password', forgetPassword)      // Forget password Route
router.post('/verify-otp', verifyOtp)
router.post('/send-otp', sendOTP)

// Export the router as the default export
export default router;
