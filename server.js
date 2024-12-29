import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import authRoute from './routes/userAuth.route.js';
import userRoute from './routes/user.route.js';
import paymentRoute from './routes/payment.route.js';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler.js';
import BRoute from './routes/businessAuth.route.js';
import adminRoute from './routes/admin.route.js'; // Import admin routes

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50
});
app.use(limiter);

app.get('/test', (req, res) => {
    res.send("Hello World");
});

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/business', BRoute);
app.use('/api/admin', adminRoute); // Add the admin route here

app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
