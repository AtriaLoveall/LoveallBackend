 import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const CardPurchaseTransaction = sequelize.define('card_purchase_transaction', {
    'transaction_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'user_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'amount': {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    'purchased_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'card_purchase_transaction',
    timestamps: false,
});

export default CardPurchaseTransaction;
