// businessProfileUpdateController.js
import { verifyJWT } from '../../services/jwt.js';
import Business from '../../models/business.model.js';

const businessProfileUpdateController = async (req, res) => {
  try {
    const updatedData = req.body;
    delete updatedData.business_id; // Prevent updating the business_id

    const [updatedRowsCount, updatedBusiness] = await Business.update(updatedData, {
      where: { business_id: decoded.id },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Business not found or no changes made' });
    }

    const response = {
      business_name: updatedBusiness[0].business_name,
      business_email: updatedBusiness[0].business_email,
      business_type: updatedBusiness[0].business_type,
      entity_type: updatedBusiness[0].entity_type,
      contact_number: updatedBusiness[0].contact_number,
      business_address: updatedBusiness[0].business_address,
      city: updatedBusiness[0].city,
      state: updatedBusiness[0].state,
      zip_code: updatedBusiness[0].zip_code,
      gstin: updatedBusiness[0].gstin,
      tan: updatedBusiness[0].tan,
      business_purpose: updatedBusiness[0].business_purpose,
      owner_name: updatedBusiness[0].owner_name,
      owner_contact_number: updatedBusiness[0].owner_contact_number,
      updated_at: updatedBusiness[0].updated_at
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in businessProfileUpdateController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default businessProfileUpdateController;