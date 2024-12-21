import { verifyJWT } from '../../services/jwt.js';
import Business from '../../models/business.model.js';
import Store from '../../models/store.model.js';

const BusinessManageManyOffersController = async (req, res) => {
  try {
    // Verify authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find business
    const business = await Business.findByPk(decoded.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Fetch stores with only required fields
    const stores = await Store.findAll({
      where: { business_id: business.business_id },
      attributes: ['store_name', 'address']
    });

    console.log('Stores found:', JSON.stringify(stores, null, 2));

    // Format response
    const formattedStores = stores.map(store => ({
      storeName: store.store_name,
      address: store.address
    }));

    console.log('Formatted stores:', JSON.stringify(formattedStores, null, 2));

    res.status(200).json(formattedStores);
  } catch (error) {
    console.error('Error in BusinessManageManyOffersController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default BusinessManageManyOffersController;