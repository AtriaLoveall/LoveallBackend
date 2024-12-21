import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Controller methods

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // in paise
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating Razorpay order');
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // Optionally, save payment details to the database
    res.send({ status: 'success' });
  } else {
    res.status(400).send({ status: 'failure' });
  }
};

// Placeholder for PhonePe order creation
export const createPhonepeOrder = async (req, res) => {
  const { amount } = req.body;

  // Implement PhonePe order creation as per their API
  // Placeholder response
  res.json({ message: 'PhonePe order creation not implemented yet.' });
};
