import {Store, Offers} from "../../models/association.js"

const home = async(req, res, next) => {
    try {
        const {brand_limit = 10, offer_limit = 10, featured_limit = 10} = req.body;
        const brand = await Store.findAll({
            attributes: ['store_id', 'category_id', 'category','store_name', 'address', 'rating'],
            limit: brand_limit
        });
        const offers = await Offers.findAll({
            where: {status: 'active'},
            attributes: ['offer_id', 'store_id', 'featured', 'offer_type', 'description', 'discount_percentage', 'minimum_purchase', 'maximum_discount', 'start_date', 'end_date', 'terms_conditions', 'number_of_uses', 'limit_per_customer'],
            order: [['discount_percentage', 'DESC']],
            limit: offer_limit
        })
        const featureOffers = await Offers.findAll({
            where: {status: 'active', featured: 1},
            attributes: ['offer_id', 'store_id', 'offer_type', 'description', 'discount_percentage', 'minimum_purchase', 'maximum_discount', 'start_date', 'end_date', 'terms_conditions', 'number_of_uses', 'limit_per_customer'],
            order: [['discount_percentage', 'DESC']],
            limit: featured_limit
        })
        return res.status(200).json({succes: true, data: {brand, offers, featureOffers }, limit:{brand_limit, offer_limit, featured_limit}, error: null})  
    } catch (error) {
        return res.status(500).json({succes: true, data: {brand: null, offers: null, featureOffers: null}, error: "Internal Server Error"});
    }
}

export default home;