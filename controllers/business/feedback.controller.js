import { Feedback, User, Store, Business } from "../../models/association.js";
import { verifyJWT } from '../../services/jwt.js';

const fetchFeedback = async (req, res, next) => {
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

        const business = await Business.findByPk(decoded.id);
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        const stores = await Store.findAll({
            where: { business_id: business.business_id },
            attributes: ['store_id']
        });

        const storeIds = stores.map(store => store.store_id);

        const feedbacks = await Feedback.findAll({
            include: [
                {
                    model: User,
                    attributes: ['first_name', 'last_name']
                },
                {
                    model: Store,
                    attributes: ['store_name']
                }
            ],
            where: { store_id: storeIds }
        });

        console.log(`Fetched ${feedbacks.length} feedbacks for business ID ${business.business_id}`);

        return res.status(200).json({ success: true, message: "Fetched successfully", feedbacks });   
    } catch (error) {
        console.error("Error in fetchFeedback:", error);
        next(error);
    }
};

export default fetchFeedback;

