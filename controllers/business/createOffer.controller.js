// Import dependencies
import { verifyJWT } from '../../services/jwt.js';
import Business from '../../models/business.model.js';
import Store from '../../models/store.model.js';
import Offers from '../../models/offer.model.js';

// Controller function for creating offers
const businessCreateOfferController = async (req, res) => {
  try {
    // Check for authorization token
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { storeName, offerType, validTill, managerName, contactNumber, address } = req.body;

    // Validate required fields
    if (!storeName || !offerType || !validTill) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the business by decoded user ID
    const business = await Business.findByPk(decoded.id);
    if (!business) {
      console.error(`Business not found for id: ${decoded.id}`);
      return res.status(404).json({ message: 'Business not found' });
    }

    // Attempt to find or create the store
    let store;
    try {
      [store] = await Store.findOrCreate({
        where: { business_id: business.business_id, store_name: storeName },
        defaults: {
          store_email: `${storeName.toLowerCase().replace(/\s/g, '')}@example.com`,
          owner_name: business.owner_name,
          phone_number: contactNumber,
          address: address,
          manager_name: managerName,
          manager_phone_no: contactNumber,
          password_hash: 'default_hash' // Placeholder hash if required
        }
      });
    } catch (error) {
      console.error('Error creating or finding store:', error);
      return res.status(500).json({ message: 'Error processing store information' });
    }

    // Attempt to create the offer
    let offer;
    try {
      offer = await Offers.create({
        store_id: store.store_id,
        offer_type: offerType,
        description: `New offer for ${storeName}`,
        discount_percentage: 10, // Default value
        start_date: new Date(),
        end_date: new Date(validTill),
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      return res.status(500).json({ message: 'Error creating offer' });
    }

    // Success response
    res.status(201).json({
      message: 'Offer created successfully',
      store: store,
      offer: offer
    });
  } catch (error) {
    console.error('Error in businessCreateOfferController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default businessCreateOfferController;