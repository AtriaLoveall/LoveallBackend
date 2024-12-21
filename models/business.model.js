import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Business = sequelize.define('business', {
    'business_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'business_name': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'business_email': {
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
    'business_type': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'entity_type': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'contact_number': {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    'business_address': {
        type: DataTypes.STRING
    },
    'gstin': {
        type: DataTypes.STRING,
        validate: {
            len: [15, 15] // GSTIN is typically 15 characters long
        }
    },
    'tan': {
        type: DataTypes.STRING,
        validate: {
            len: [10, 10] // TAN is typically 10 characters long
        }
    },
    'business_purpose': {
        type: DataTypes.TEXT
    },
    'owner_name': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'owner_contact_number': {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'updated_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'verified': {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    'manual_verified': {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    'temp_pass': {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    'otp': {
        type: DataTypes.INTEGER,
        defaultValue: false
    },
    'otp_expiration_time': {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: false
    },
}, {
    tableName: 'business', // Specify the table name
    timestamps: false // Disable automatic timestamps
});

export default Business;