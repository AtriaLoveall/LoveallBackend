import { verifyJWT } from '../../services/jwt.js';
import { Business, Store, Offers } from '../../models/association.js';
import { Op } from 'sequelize';

export const businessYourOffersController = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const business = await Business.findByPk(decoded.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const stores = await Store.findAll({
      where: { business_id: business.business_id },
      include: [{
        model: Offers,
        attributes: ['offer_id', 'offer_type', 'description', 'end_date', 'status'],
        required: false // This makes it a LEFT JOIN, including stores without offers
      }],
      attributes: ['store_id', 'store_name', 'store_address', 'manager_name', 'manager_contact', 'logo']
    });

    // If no stores found, return empty array
    if (!stores || stores.length === 0) {
      return res.status(200).json([]);
    }

    // Format the response to ensure offers is always an array
    const formattedStores = stores.map(store => ({
      ...store.toJSON(),
      offers: store.offers || []
    }));

    return res.status(200).json(formattedStores);
  } catch (error) {
    console.error('Error in businessYourOffersController:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const editOfferController = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { offer_id, store_id, offer_type, end_date } = req.body;

    const business = await Business.findByPk(decoded.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Verify store belongs to business
    const store = await Store.findOne({
      where: { 
        store_id,
        business_id: business.business_id
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found or unauthorized' });
    }

    // Update offer
    const [updatedRowsCount, updatedOffers] = await Offers.update({
      offer_type,
      end_date,
      updated_at: new Date()
    }, {
      where: { offer_id },
      returning: true
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    return res.status(200).json({ message: 'Offer updated successfully', offer: updatedOffers[0] });
  } catch (error) {
    console.error('Error in editOfferController:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteOfferController = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { offer_id } = req.params;

    const business = await Business.findByPk(decoded.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Verify offer belongs to business's store
    const offer = await Offers.findOne({
      where: { offer_id },
      include: [{
        model: Store,
        where: { business_id: business.business_id }
      }]
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found or unauthorized' });
    }

    await offer.destroy();

    return res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error in deleteOfferController:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

