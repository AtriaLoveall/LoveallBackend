import { Router } from 'express';
import { businessAuthMiddleware } from "../middleware/isAuthenticated.js";
import businessRegister from '../controllers/business/register.controller.js';
import businessVerifyOtp from '../controllers/business/verifyOtp.controller.js';
import changePassword from '../controllers/business/changePassword.controller.js';
import profileController from '../controllers/business/profile.controller.js';
import businessProfileUpdateController from '../controllers/business/profileUpdate.controller.js';
import businessCreateOfferController from '../controllers/business/createOffer.controller.js';
import { 
  businessYourOffersController,
  editOfferController,
  deleteOfferController
} from '../controllers/business/yourOffers.controller.js';
import businessCheckStoresController from '../controllers/business/checkStores.controller.js';
import BusinessManageManyOffersController from '../controllers/business/manyOffer.controller.js';
import businessProfileHeaderController from '../controllers/business/profileHeader.controller.js';
import fetchFeedback from '../controllers/business/feedback.controller.js';
import { BusinessTransactionController } from '../controllers/business/transaction.controller.js';
import { addOfferBusinessController, getBusinessStoresController } from '../controllers/business/addOfferBusiness.controller.js';
import { getQrCode, deleteQrCode } from '../controllers/business/qrBusiness.controller.js';
import { 
  getBusinessStores, 
  addStore, 
  updateStore, 
  deleteStore 
} from '../controllers/business/businessProfileStores.controller.js';
import {
  getStoreDetails,
  updateStoreDetails
} from '../controllers/business/businessProfileStoreEdit.controller.js';
import { exportCSV } from '../controllers/business/transaction.controller.js';
import { downloadInvoices } from '../controllers/admin/transactionAdminController.js';

const router = Router();

// Existing routes
router.post('/register', businessRegister);
router.post('/verify-otp', businessVerifyOtp);
router.post('/change-password', changePassword);
router.post('/profile', businessAuthMiddleware, profileController);
router.put('/update-profile', businessAuthMiddleware, businessProfileUpdateController);
router.post('/create-offer', businessCreateOfferController);
router.post('/add-offer', businessAuthMiddleware, addOfferBusinessController);
router.post('/your-offers', businessAuthMiddleware, businessYourOffersController);
router.put('/edit-offer', businessAuthMiddleware, editOfferController);
router.delete('/delete-offer/:offer_id', businessAuthMiddleware, deleteOfferController);
router.get('/check-stores', businessAuthMiddleware, getBusinessStoresController);
router.get('/manage-many-offers', BusinessManageManyOffersController);
router.get('/profile-header', businessProfileHeaderController);
router.get('/feedback', businessAuthMiddleware, fetchFeedback);
router.post('/transaction', businessAuthMiddleware, BusinessTransactionController);
router.get('/qr-code/:offerId', businessAuthMiddleware, getQrCode);
router.delete('/qr-code/:offerId', businessAuthMiddleware, deleteQrCode);

// Store management routes
router.get('/stores', businessAuthMiddleware, getBusinessStores);
router.post('/stores', businessAuthMiddleware, addStore);
router.put('/stores/:store_id', businessAuthMiddleware, updateStore);
router.delete('/stores/:store_id', businessAuthMiddleware, deleteStore);

// Store edit routes
router.get('/stores/:store_id', businessAuthMiddleware, getStoreDetails);
router.put('/stores/:store_id', businessAuthMiddleware, updateStoreDetails);

// download routes
router.get('/download-invoices', businessAuthMiddleware, downloadInvoices);
router.get('/export-csv', businessAuthMiddleware, exportCSV);

export default router;

