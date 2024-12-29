import { verifyJWT } from '../../services/jwt.js';
import { Store } from '../../models/association.js';

// Get store details
export const getStoreDetails = async (req, res) => {
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
      },
      attributes: [
        'store_id',
        'store_name',
        'logo',
        'address',
        'city',
        'state',
        'zip_code',
        'manager_contact',
        'store_email',
        'business_description',
        'updated_at'
      ]
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    return res.status(200).json({ store });
  } catch (error) {
    console.error('Error in getStoreDetails:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update store details
export const updateStoreDetails = async (req, res) => {
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

    // Update store details
    const {
      store_name,
      logo,
      address,
      city,
      state,
      zip_code,
      manager_contact,
      store_email,
      business_description
    } = req.body;

    await store.update({
      store_name,
      logo,
      address,
      city,
      state,
      zip_code,
      manager_contact,
      store_email,
      business_description,
      updated_at: new Date()
    });

    return res.status(200).json({
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    console.error('Error in updateStoreDetails:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

