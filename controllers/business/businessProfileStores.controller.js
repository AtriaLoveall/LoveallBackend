import { verifyJWT } from '../../services/jwt.js';
import { Business, Store } from '../../models/association.js';

export const getBusinessStores = async (req, res) => {
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

    const business = await Business.findByPk(decoded.id, {
      attributes: ['business_name', 'business_email'],
      include: [{
        model: Store,
        attributes: [
          'store_id',
          'store_name',
          'store_email',
          'store_address',
          'manager_name',
          'manager_contact',
          'phone_number'
        ]
      }]
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    return res.status(200).json({
      business_name: business.business_name,
      business_email: business.business_email,
      stores: business.stores
    });
  } catch (error) {
    console.error('Error in getBusinessStores:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Add new store
export const addStore = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    const newStore = await Store.create({
      ...req.body,
      business_id: decoded.id
    });

    return res.status(201).json({
      message: 'Store added successfully',
      store: newStore
    });
  } catch (error) {
    console.error('Error in addStore:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update store
export const updateStore = async (req, res) => {
  try {
    const { store_id } = req.params;
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    const store = await Store.findOne({
      where: {
        store_id,
        business_id: decoded.id
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    await store.update(req.body);

    return res.status(200).json({
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    console.error('Error in updateStore:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete store
export const deleteStore = async (req, res) => {
  try {
    const { store_id } = req.params;
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    const store = await Store.findOne({
      where: {
        store_id,
        business_id: decoded.id
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    await store.destroy();

    return res.status(200).json({
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteStore:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
