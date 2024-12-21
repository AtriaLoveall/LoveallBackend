import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js"; // Adjust this import path as per your project structure

const Volunteer = sequelize.define('user_details', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    full_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    contact_number: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    residential_area: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    pincode: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    municipality_ward_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bbmp_ward_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('pathfinder', 'engager', 'enablers'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'user_details',
    timestamps: false
});

export default Volunteer;
