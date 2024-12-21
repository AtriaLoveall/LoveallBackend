import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js"; 

const Donation = sequelize.define('donation', {
    'id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'email': {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    'name': {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    'amount': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    'phone': {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
            len: [10, 10]
        }
    },
    'nationality': {
        type: DataTypes.STRING(20),
        allowNull: true
    }
}, {
    tableName: 'donation',
    timestamps: false
});

export default Donation;
