import { verifyJWT } from '../../services/jwt.js';
import Business from '../../models/business.model.js';

const businessProfileHeaderController = async (req, res) => {
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
      console.error("Token verification error:", error);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const business = await Business.findOne({
      where: { business_id: decoded.id },
      attributes: ['business_name', 'business_address', 'city', 'state', 'zip_code']
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const response = {
      business_name: business.business_name || '',
      business_address: business.business_address || '',
      city: business.city || '',
      state: business.state || '',
      zip_code: business.zip_code || ''
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in businessProfileHeaderController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default businessProfileHeaderController;