import { Router } from "express";
import { getTransactions, exportTransactionsCSV, downloadInvoices } from "../controllers/admin/transactionAdminController.js";
import { getBusinessAccounts, getUserAccounts, getBusinessDetails, getUserDetails } from "../controllers/admin/accountAdminController.js";
import { getDashboardData } from "../controllers/admin/dashboardAdminController.js";
import manualVerifyBusiness from "../controllers/admin/ManualVerification.js";
import { adminAuthMiddleware } from "../middleware/isAuthenticated.js";
import removeBusiness from "../controllers/admin/removeBusiness.controller.js";

const router = Router();

// Existing routes
router.post('/manual-verification', adminAuthMiddleware, manualVerifyBusiness);

// Transaction routes
router.get('/transactions', adminAuthMiddleware, getTransactions);
router.get('/transactions/export', adminAuthMiddleware, exportTransactionsCSV);
router.get('/transactions/invoices', adminAuthMiddleware, downloadInvoices);

// Account routes
router.get('/business-accounts', adminAuthMiddleware, getBusinessAccounts);
router.get('/user-accounts', adminAuthMiddleware, getUserAccounts);
router.get('/business-accounts/:businessId', adminAuthMiddleware, getBusinessDetails);
router.get('/user-accounts/:userId', adminAuthMiddleware, getUserDetails);

// Dashboard route
router.get('/dashboard', adminAuthMiddleware, getDashboardData);
router.delete('/remove-business', adminAuthMiddleware, removeBusiness);

export default router;

