import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Feedback = sequelize.define('feedback', {
    'feedback_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'user_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'store_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'rating': {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    },
    'comments': {
        type: DataTypes.TEXT
    },
    'created_at': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'feedback',
    timestamps: false,
});

export default Feedback;