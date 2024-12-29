import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const QrCodeBusiness = sequelize.define('qr_code_business', {
    qr_code_business_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    offer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'offers', // Name of the related table
            key: 'offer_id'
        },
        onDelete: 'CASCADE'
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'qr_code_business',
    timestamps: false
});

export default QrCodeBusiness;
