import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Otp = sequelize.define('otps', {
    'id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'email': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'otp_code': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'otp_purpose': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'expiration_time': {
        type: DataTypes.DATE,
        allowNull: false
    },
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'attempt_count': {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    'verified': {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    'ip_address': {
        type: DataTypes.STRING(45)
    }
}, {
    tableName: 'otps',
    timestamps: false,
});

export default Otp;
