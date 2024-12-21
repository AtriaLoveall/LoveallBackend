import { User, Business, OfferTransaction, Offers, Store } from '../../models/association.js';
import { Op } from 'sequelize';
import sequelize from '../../config/dbConfig.js';

const getDashboardData = async (req, res) => {
    try {
        const { startDate, endDate, offerType, businessType } = req.query;

        // Build the where clause based on filters
        const whereClause = {};
        if (startDate && endDate) {
            whereClause.transaction_date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        if (offerType) {
            whereClause['$Offer.offer_type$'] = offerType;
        }
        if (businessType) {
            whereClause['$Store.Business.business_type$'] = businessType;
        }

        // Fetch total users
        const totalUsers = await User.count();

        // Fetch active businesses
        const activeBusinesses = await Business.count({ where: { verified: true } });

        // Fetch total transactions and offers
        const totalTransactions = await OfferTransaction.count({ where: whereClause });
        const totalOffers = await Offers.count();

        // Fetch weekly activity data
        const weeklyActivity = await OfferTransaction.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('transaction_date')), 'date'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total']
            ],
            where: {
                transaction_date: {
                    [Op.gte]: sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 13 DAY)')
                },
                ...whereClause
            },
            group: [sequelize.fn('DATE', sequelize.col('transaction_date'))],
            order: [[sequelize.fn('DATE', sequelize.col('transaction_date')), 'ASC']]
        });

        // Fetch top businesses
        const topBusinesses = await OfferTransaction.findAll({
            attributes: [
                'Store.store_name',
                [sequelize.fn('COUNT', sequelize.col('offer_transaction.transaction_id')), 'transactions'],
                [sequelize.fn('SUM', sequelize.col('offer_transaction.amount')), 'revenue']
            ],
            include: [
                {
                    model: Store,
                    attributes: []
                }
            ],
            where: whereClause,
            group: ['Store.store_id'],
            order: [[sequelize.fn('SUM', sequelize.col('offer_transaction.amount')), 'DESC']],
            limit: 3
        });

        // Fetch user growth data
        const userGrowth = await User.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
                [sequelize.fn('COUNT', sequelize.col('user_id')), 'users']
            ],
            where: {
                created_at: {
                    [Op.gte]: sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 6 MONTH)')
                }
            },
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'ASC']]
        });

        // Fetch business category distribution
        const categoryDistribution = await Store.findAll({
            attributes: [
                'category',
                [sequelize.fn('COUNT', sequelize.col('store_id')), 'count']
            ],
            group: ['category'],
            order: [[sequelize.fn('COUNT', sequelize.col('store_id')), 'DESC']],
            limit: 5
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                activeBusinesses,
                totalTransactions,
                totalOffers,
                weeklyActivity,
                topBusinesses,
                userGrowth,
                categoryDistribution
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

export { getDashboardData };

