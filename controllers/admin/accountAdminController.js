import { Business, User } from '../../models/association.js';

const getBusinessAccounts = async (req, res) => {
    try {
        const businesses = await Business.findAll({
            attributes: ['business_id', 'business_name', 'business_email', 'created_at', 'manual_verified'],
            order: [['created_at', 'DESC']]
        });

        const transformedBusinesses = businesses.map(business => ({
            business_id: business.business_id,
            business_name: business.business_name,
            email: business.business_email,
            registered_date: business.created_at,
            status: business.manual_verified ? 'Approved' : 'Pending'
        }));

        res.json({
            success: true,
            businesses: transformedBusinesses
        });
    } catch (error) {
        console.error('Error fetching business accounts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching business accounts',
            error: error.message
        });
    }
};

const getUserAccounts = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone_number', 'created_at', 'verified'],
            order: [['created_at', 'DESC']]
        });

        const transformedUsers = users.map(user => ({
            user_id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            phone_number: user.phone_number,
            registered_date: user.created_at,
            status: user.verified ? 'Verified' : 'Unverified'
        }));

        res.json({
            success: true,
            users: transformedUsers
        });
    } catch (error) {
        console.error('Error fetching user accounts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user accounts',
            error: error.message
        });
    }
};

const getBusinessDetails = async (req, res) => {
    try {
        const { businessId } = req.params;
        const business = await Business.findByPk(businessId, {
            attributes: ['business_id', 'business_name', 'business_email', 'created_at', 'manual_verified']
        });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found'
            });
        }

        res.json({
            success: true,
            business: {
                business_name: business.business_name,
                email: business.business_email,
                registered_date: business.created_at,
                status: business.manual_verified ? 'Approved' : 'Pending'
            }
        });
    } catch (error) {
        console.error('Error fetching business details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching business details',
            error: error.message
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone_number', 'created_at', 'verified']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                phone_number: user.phone_number,
                registered_date: user.created_at,
                status: user.verified ? 'Verified' : 'Unverified'
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: error.message
        });
    }
};

export { getBusinessAccounts, getUserAccounts, getBusinessDetails, getUserDetails };

