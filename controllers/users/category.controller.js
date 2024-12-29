import {Category} from '../../models/association.js'

const category = async (req, res, next) => {
    try {
        const {count, rows} = await Category.findAndCountAll({
            attributes: ['category_id', 'category_name']
        });
        return res.status(200).json({success: true, data: rows, total: count});
    } catch (error) {
        next(error);
    }

}

export default category;