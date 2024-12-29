import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { Admin } from '../models/association.js';
import { hashPassword } from '../services/passwordHash.js';

dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
)

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error("Admin credentials not provided in .env");
        }

        const password_hash = await hashPassword(adminPassword);

        const [admin, created] = await Admin.findOrCreate({
            where: { admin_email: adminEmail },
            defaults: { 
                password_hash: password_hash,
                role: "admin"
            },
        });

        if (created) {
            console.log(`Admin account created: ${adminEmail}`);
        } else {
            console.log(`Admin account already exists: ${adminEmail}`);
        }
    } catch (error) {
        console.log("Some error occurred\n" + error);
    }
};

initializeDatabase();

export default sequelize;