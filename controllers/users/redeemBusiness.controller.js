import { verifyJWT } from '../../services/jwt.js';
import { User, QrCodeBusiness, QrCodeUser, Offers } from '../../models/association.js';

export const redeemOffer = async (req, res) => {
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

    const { offer_id } = req.body;

    const user = await User.findByPk(decoded.id, {
      attributes: ['user_id', 'first_name', 'last_name']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const offer = await Offers.findByPk(offer_id, {
      include: [{ model: QrCodeBusiness }]
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (!offer.qr_code_business) {
      return res.status(404).json({ message: 'QR code for this offer not found' });
    }

    const qrCodeData = JSON.parse(offer.qr_code_business.data);
    const userQrCodeData = {
      ...qrCodeData,
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name
    };

    const newUserQrCode = await QrCodeUser.create({
      qr_code_business_id: offer.qr_code_business.qr_code_business_id,
      user_id: user.user_id,
      data: JSON.stringify(userQrCodeData)
    });

    res.status(200).json({
      success: true,
      message: 'QR code generated successfully',
      qrCodeData: JSON.stringify(userQrCodeData)
    });
  } catch (error) {
    console.error('Error in redeemOffer:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

