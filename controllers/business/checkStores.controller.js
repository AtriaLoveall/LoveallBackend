import { verifyJWT } from '../../services/jwt.js';
import Business from '../../models/business.model.js';
import Store from '../../models/store.model.js';

const businessCheckStoresController = async (req, res) => {
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
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const business = await Business.findByPk(decoded.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const storesCount = await Store.count({
      where: { business_id: business.business_id }
    });

    res.status(200).json({ hasStores: storesCount > 0 });
  } catch (error) {
    console.error('Error in businessCheckStoresController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default businessCheckStoresController;