import sequelize from "../config/dbConfig.js";
import {DataTypes} from "sequelize";

const Category = sequelize.define('categories', {
    'category_id': {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    'category_name': {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'updated_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'categories',
    timestamps: false
})

export default Category;