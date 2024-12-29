import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Offers = sequelize.define('offers', {
    'offer_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'store_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'offer_type': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'description': {
        type: DataTypes.TEXT
    },
    'discount_percentage': {
        type: DataTypes.DECIMAL(5, 2)
    },
    'minimum_purchase': {
        type: DataTypes.DECIMAL(10, 2)
    },
    'maximum_discount': {
        type: DataTypes.DECIMAL(10, 2)
    },
    'start_date': {
        type: DataTypes.DATE
    },
    'end_date': {
        type: DataTypes.DATE
    },
    'status': {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'updated_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    },
    'terms_conditions': {
        type: DataTypes.TEXT
    },
    'number_of_uses': {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    'limit_per_customer': {
        type: DataTypes.INTEGER
    },
    'featured': {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'offers',
    timestamps: false,
});

export default Offers;
