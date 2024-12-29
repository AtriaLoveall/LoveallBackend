import express from 'express';
import { userAuthMiddleware } from '../middleware/isAuthenticated.js';
import discountController from '../controllers/users/discount.controller.js';
import transaction from '../controllers/users/transaction.controller.js';
import feedback from '../controllers/users/feedback.controller.js';
import category from '../controllers/users/category.controller.js';
import dashboard from '../controllers/users/dashboard.controller.js';
import home from '../controllers/users/home.controller.js';
import card from '../controllers/users/card.controller.js';
import { getPersonalInfo, updatePersonalInfo } from '../controllers/users/profile.controller.js';
import { redeemOffer } from '../controllers/users/redeemBusiness.controller.js';

const router = express.Router();

router.post('/home', home);
router.post('/discount', discountController);
router.post('/transaction', userAuthMiddleware, transaction);
router.post('/category', category);
router.post('/card', userAuthMiddleware, card);
router.post('/feedback', userAuthMiddleware, feedback);
router.get('/dashboard', userAuthMiddleware, dashboard);
router.get('/profile', userAuthMiddleware, getPersonalInfo);
router.put('/profile', userAuthMiddleware, updatePersonalInfo);
router.post('/redeem', userAuthMiddleware, redeemOffer);

export default router;

