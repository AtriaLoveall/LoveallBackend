import { where } from 'sequelize';
import {CardPurchaseTransaction, OfferTransaction} from '../../models/association.js'

const transaction = async(req, res, next) => {
    const {page = 1, limit = 10, type} = req.body;
    const offset = (page - 1) * limit;
    let transactionRecord;
    try {
        if (!(Number.isInteger(page) && page>=1)) {
            return res.status(400).json({success: false, message: "Invalid page number."})
        }

        if (!Number.isInteger(limit)) {
            return res.status(400).json({status: false, message: "Limit can't be decimal value"});
        }

       if (type === 'offer') {
        transactionRecord = await OfferTransaction.findAndCountAll({
            where: {user_id: req.user.id},
            attributes: ['offer_id', 'store_id', 'transaction_date', 'amount', 'discount_applied'],
            order: [['transaction_date', 'DESC']],
            limit,
            offset
        }
        )
       } 
       else if (type === 'card') {
        transactionRecord = await CardPurchaseTransaction.findAndCountAll({
            where: {user_id: req.user.id},
            attributes: ['amount', 'purchased_at'],
            order: [['purchased_at', 'DESC']],
            limit,
            offset
        })
       }
       else {
        return res.status(400).json({success: false, message: "Invalid request"});
       }
       
       const totalPages = Math.ceil(transactionRecord.count / limit);
       if (page > totalPages) return res.status(400).json({success: false, message: "Not enough data to show."})
       return res.status(200).json({
            success: true,
            data: transactionRecord.rows,
            user: req.user.id,
            pagination: {
                totalItems: transactionRecord.count,
                totalPages,
                currentPage: page,
                limit
            }
        })
    } catch (error) {
        next(error);
    } 
}

export default transaction;

//add transaction id and which offer is applied