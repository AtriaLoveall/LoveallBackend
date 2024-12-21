import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const OfferTransaction = sequelize.define('offer_transaction', {
    'transaction_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'user_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'offer_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'store_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'transaction_date': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'amount': {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    'discount_applied': {
        type: DataTypes.DECIMAL(10, 2)
    },
    'status': {
        type: DataTypes.ENUM('completed', 'pending', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    tableName: 'offer_transaction',
    timestamps: false,
});

export default OfferTransaction;
