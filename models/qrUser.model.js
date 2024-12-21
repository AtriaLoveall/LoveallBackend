import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const QrCodeUser = sequelize.define('qr_code_user', {
    qr_code_user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    qr_code_business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'qr_code_business',
            key: 'qr_code_business_id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'qr_code_user',
    timestamps: false
});

export default QrCodeUser;
