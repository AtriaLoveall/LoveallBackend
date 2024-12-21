import {Store} from "../../models/association.js";
import {Offers} from "../../models/association.js";
import { where, Op, Sequelize } from "sequelize";
const discountController = async (req, res, next) => {
    try {
        const { offer_id, category, search, type, rating, distance, discount, longitude, latitude, page = 1, limit = 12, featured } = req.body;

        if (!(Number.isInteger(page) && page>=1)) {
            return res.status(400).json({success: false, message: "Invalid page number."})
        }

        if (!Number.isInteger(limit)) {
            return res.status(400).json({status: false, message: "Limit can't be decimal value"});
        }
        
        // Calculating offset
        const offset = (page - 1) * limit; 

        // Initial query for stores
        let offerQuery = {
            where: {},
            attributes: ['offer_id', 'offer_type', 'description', 'discount_percentage', 'minimum_purchase', 'maximum_discount', 'end_date', 'terms_conditions', 'featured'],
            include: [{
                model: Store,
                where: {status: 'active'},
                attributes: ['store_name', 'address', 'latitude', 'longitude', 'category', 'rating', 'opening_hours', 'category_id'],
            }],
            limit,
            offset
        }

        // Checking for particular offer
        if (offer_id) {
            offerQuery.where.offer_id = offer_id;
        }

        // Checking for partcular category
        if (category) {
            offerQuery.include[0].where.category_id = category;
        }

        // Checking for featured offer
        if (featured) {
            offerQuery.where.featured = featured;
        }

        // Checking for particular offer type
        if (type) {
            offerQuery.where.offer_type = type;
        }

        // Checking for rating which is greater than or equal to
        if (rating) {
            offerQuery.include[0].where.rating = {[Op.gte]: parseFloat(rating)}
        }

        // Checking for discount which is greater than or equal to
        if (discount) {
            offerQuery.where.discount_percentage = {[Op.gte]: parseFloat(discount)}
        }

        // Checking for particular search by the user
        if (search) {
            offerQuery.where[Op.or]= [  
                {'$Store.store_name$': {[Op.like]: `%${search}%`}},
                {'$Store.category$': {[Op.like]: `%${search}%`}},
                {'$Store.address$': {[Op.like]: `%${search}%`}},
                { offer_type: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { discount_percentage: { [Op.like]: `%${search}%` } }
            ];
        }
        const {count, rows} = await Offers.findAndCountAll(offerQuery);


        // Calculating the number of pages
        const totalPages = Math.ceil(count / limit);
            
        if (page > totalPages) return res.status(400).json({success: false, message: "Not enough data to show."})
        return res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });
        
    }
    catch (error) {
        return next(error);
    }
};

export default discountController;