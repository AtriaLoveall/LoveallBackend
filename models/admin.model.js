import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Admin = sequelize.define('admin', {
    'admin_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'admin_email': {
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
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'updated_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'otp': {
        type: DataTypes.STRING
    },
    'otp_expiration_time': {
        type: DataTypes.DATE
    }
}, {
    tableName: 'admin',
    timestamps: false,
});

export default Admin;
