import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const AdminActivityLog = sequelize.define('admin_activity_log', {
    'activity_id': {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'admin_id': {
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
    tableName: 'admin_activity_log',
    timestamps: false,
});

export default AdminActivityLog;
