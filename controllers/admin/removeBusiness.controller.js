import { Business } from '../../models/association.js';

const removeBusiness = async (req, res, next) => {
    const { business_email } = req.body;

    try {
        // Check if the business exists
        if (!business_email) {
            return res.status(400).json({ success: false, message: "Business email is required" });
        }
        
        const business = await Business.findOne({ where: { business_email } });
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        // Delete the business record
        await Business.destroy({ where: { business_email } });

        return res.status(200).json({ success: true, message: "Business successfully removed." });
    } catch (error) {
        console.error("Error in removing business:", error);
        return next(error);
    }
};

export default removeBusiness;
