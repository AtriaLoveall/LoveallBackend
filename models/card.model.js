import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Cards = sequelize.define('cards', {
    'card_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'card_number': {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    'user_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'card_type': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'purchase_date': {
        type: DataTypes.DATE,
        allowNull: false
    },
    'expiry_date': {
        type: DataTypes.DATE,
        allowNull: false
    },
    'discount_code': {
        type: DataTypes.STRING,
        unique: true
    },
}, {
    tableName: 'cards',
    timestamps: false,
});

export default Cards;
