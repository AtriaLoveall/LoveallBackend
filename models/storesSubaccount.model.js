import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const StoresSubaccount = sequelize.define('stores_subaccount', {
    'subaccount_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'store_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'subaccount_name': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'email_id': {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    'password_hash': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'role': {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'stores_subaccount',
    timestamps: false,
});

export default StoresSubaccount;
