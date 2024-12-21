// Import models
import Admin from "./admin.model.js";
import AdminActivityLog from "./adminActivityLog.model.js";
import BusinessActivityLog from "./businessActivityLog.model.js";
import Business from "./business.model.js";
import Cards from "./card.model.js";
import CardPurchaseTransaction from "./cardPurchaseTransaction.model.js";
import Feedback from "./feedback.model.js";
import Offers from "./offer.model.js";
import OfferTransaction from "./offerTransaction.model.js";
import Otp from "./otp.model.js";
import Store from "./store.model.js";
import User from "./user.model.js";
import Category from "./category.model.js";
import StoresSubaccount from "./storesSubaccount.model.js";
import Donation from "./donation.model.js";
import Volunteer from "./volunteer.model.js";
import QrCodeBusiness from "./qrBusiness.model.js";
import QrCodeUser from "./qrUser.model.js";

// Users associations
User.hasMany(CardPurchaseTransaction, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(OfferTransaction, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Cards, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Feedback, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(QrCodeUser, { foreignKey: "user_id", onDelete: "CASCADE" });

// Business associations
Business.hasMany(CardPurchaseTransaction, { foreignKey: "business_id", onDelete: "CASCADE" });
Business.hasMany(BusinessActivityLog, { foreignKey: "business_id", onDelete: "CASCADE" });
Business.hasMany(Feedback, { foreignKey: "business_id", onDelete: "CASCADE" });
Business.hasMany(Store, { foreignKey: "business_id", onDelete: "CASCADE" });

// Stores associations
Store.hasMany(StoresSubaccount, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasMany(Offers, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasMany(OfferTransaction, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasMany(Feedback, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.hasMany(BusinessActivityLog, { foreignKey: "store_id", onDelete: "CASCADE" });
Store.belongsTo(Category, { foreignKey: "category_id", as: "storeCategory", onDelete: "CASCADE" });
Store.belongsTo(Business, { foreignKey: "business_id", onDelete: "CASCADE" });

// Category associations
Category.hasMany(Store, { foreignKey: "category_id", onDelete: "CASCADE" });

// StoresSubaccount associations
StoresSubaccount.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });

// Offers associations
Offers.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });
Offers.hasOne(QrCodeBusiness, { foreignKey: "offer_id", onDelete: "CASCADE" });

// QRCodeBusiness associations
QrCodeBusiness.belongsTo(Offers, { foreignKey: "offer_id", onDelete: "CASCADE" });
QrCodeBusiness.hasMany(QrCodeUser, { foreignKey: "qr_code_business_id", onDelete: "CASCADE" });

// QRCodeUser associations
QrCodeUser.belongsTo(QrCodeBusiness, { foreignKey: "qr_code_business_id", onDelete: "CASCADE" });
QrCodeUser.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// CardPurchaseTransaction associations
CardPurchaseTransaction.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
CardPurchaseTransaction.belongsTo(Business, { foreignKey: "business_id", onDelete: "CASCADE" });

// OfferTransaction associations
OfferTransaction.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
OfferTransaction.belongsTo(Offers, { foreignKey: "offer_id", onDelete: "CASCADE" });
OfferTransaction.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });

// Cards associations
Cards.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// Feedback associations
Feedback.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
Feedback.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });

// BusinessActivityLog associations
BusinessActivityLog.belongsTo(Store, { foreignKey: "store_id", onDelete: "CASCADE" });
BusinessActivityLog.belongsTo(Business, { foreignKey: "business_id", onDelete: "CASCADE" });

// Admin associations
Admin.hasMany(AdminActivityLog, { foreignKey: "admin_id", onDelete: "CASCADE" });

// AdminActivityLog associations
AdminActivityLog.belongsTo(Admin, { foreignKey: "admin_id", onDelete: "CASCADE" });

// Export models for access in other parts of the application
export {
  User,
  Store,
  StoresSubaccount,
  Offers,
  CardPurchaseTransaction,
  OfferTransaction,
  Cards,
  Feedback,
  Otp,
  Admin,
  AdminActivityLog,
  BusinessActivityLog,
  Category,
  Business,
  Donation,
  Volunteer,
  QrCodeBusiness,
  QrCodeUser,
};
