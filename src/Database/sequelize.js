import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const requiredEnvVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE', 'DB_PORT', 'NODE_ENV'];
const missingVariables = requiredEnvVariables.filter(variable => !process.env[variable]);

if (missingVariables.length > 0) {
    console.error('Missing environment variables:', missingVariables.join(', '));
    throw new Error('Missing environment variables. Please ensure all required environment variables are set');
}

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, NODE_ENV } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: NODE_ENV === 'DEVELOPMENT' ? console.log : false,
});

sequelize.authenticate()
    .then(() => console.log('Database connection has been established successfully.'))
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });

export default sequelize;