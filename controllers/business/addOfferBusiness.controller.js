import { verifyJWT } from '../../services/jwt.js';
import { Business, Store, Offers } from '../../models/association.js';

export const addOfferBusinessController = async (req, res) => {
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

    const { store_id, offer_type, end_date, description } = req.body;

    // Verify business owns the store
    const store = await Store.findOne({
      where: {
        store_id,
        business_id: decoded.id
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found or unauthorized' });
    }

    // Create new offer
    const offer = await Offers.create({
      store_id,
      offer_type,
      end_date,
      description,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      message: 'Offer created successfully',
      offer
    });

  } catch (error) {
    console.error('Error in addOfferBusinessController:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getBusinessStoresController = async (req, res) => {
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

    const stores = await Store.findAll({
      where: { business_id: decoded.id },
      attributes: ['store_id', 'store_name', 'store_address', 'manager_name', 'manager_contact']
    });

    return res.status(200).json(stores);
  } catch (error) {
    console.error('Error in getBusinessStoresController:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

