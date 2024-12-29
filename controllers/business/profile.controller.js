import {Business} from '../../models/association.js';

const profileController = async (req, res, next) => {
  try {
    const business = await Business.findOne({
      where: { business_id: req.business.id },
      attributes: [
        'business_name',
        'business_email',
        'business_type',
        'entity_type',
        'contact_number',
        'business_address',
        'gstin',
        'tan',
        'business_purpose',
        'owner_name',
        'owner_contact_number',
        'updated_at'
      ]
    });

    console.log("Found business:", business ? business.business_name : 'Not found');

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const response = {
      business_name: business.business_name || '',
      business_email: business.business_email || '',
      business_type: business.business_type || '',
      entity_type: business.entity_type || '',
      contact_number: business.contact_number || '',
      business_address: business.business_address || '',
      city: business.city || '',
      state: business.state || '',
      zip_code: business.zip_code || '',
      gstin: business.gstin || '',
      tan: business.tan || '',
      business_purpose: business.business_purpose || '',
      owner_name: business.owner_name || '',
      owner_contact_number: business.owner_contact_number || '',
      updated_at: business.updated_at || new Date()
    };

    res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export default profileController;