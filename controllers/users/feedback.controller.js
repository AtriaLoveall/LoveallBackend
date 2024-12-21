import {Offers, Feedback} from "../../models/association.js";
import { where } from "sequelize";


const feedback = async (req, res, next) => {
    const {store_id, offer_id, comments, rating} = req.body;

    // Vaalidate rating
    if (!store_id || !offer_id || !rating ) {
        return res.status(201).json({success: false, message: "All fields are Compulsory."});
    }
    

    // Ensure rating should be between 1 and 5
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({success: false, message: "Rating must be between 0 and 5"});
    }
    
    try {
        // Check offer exist or not
        const offer = await Offers.findOne({
            where: {store_id, offer_id}
        });
        
        if (!offer) {
            return res.status(404).json({success: false, message: "Offer doesn't exist."});
        }
        

        // Create the feedback
        const feedback = await Feedback.create({user_id: req.user.id, store_id, offer_id, comments, rating})
        if (feedback) {
            return res.status(201).json({success: true, message: "Thank you for giving feedback", data: feedback});
        }
        else {
            return res.status(500).json({success: false, message: "Something error occured"});
        }
    }
    catch (error) {
       return next(error); 
    }
}

export default feedback;

//whitespace need to be checked in comments.