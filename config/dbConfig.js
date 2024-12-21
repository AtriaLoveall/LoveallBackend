import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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


try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
}
catch (error) {
    console.log("Some error occured\n" + error);
}

export default sequelize;