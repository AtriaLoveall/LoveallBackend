import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const UserActivityLog = sequelize.define('user_activity_log', {
    'activity_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'user_id': {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'action': {
        type: DataTypes.STRING,
        allowNull: false
    },
    'action_date': {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_activity_log',
    timestamps: false,
});

export default UserActivityLog;
