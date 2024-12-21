import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const User = sequelize.define('users', {
    'user_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'first_name': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'last_name': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'email': {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    'phone_number': {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    'password_hash': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'address': {
        type: DataTypes.STRING
    },
    'profile_picture': {
        type: DataTypes.BLOB
    },
    'date_of_birth': {
        type: DataTypes.DATE
    },
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'updated_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'referral_id': {
        type: DataTypes.STRING
    },
    'referred_by': {
        type: DataTypes.STRING
    },
    'otp': {
        type: DataTypes.STRING,
        validate: {
            isNumeric: true,
            len: [6, 6]
        }
    },
    'otp_expiration_time': {
        type: DataTypes.TIME
    },
    'verified': {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    // Model options
    tableName: 'users', // Specify the existing table name
    timestamps: false, // Disable automatic timestamps since you're managing them
})

export default User;