import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, NODE_ENV } = process.env;

export default {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: NODE_ENV === 'DEVELOPMENT' ? console.log : false,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: NODE_ENV === 'DEVELOPMENT' ? console.log : false,
  },
};

// npx sequelize-cli db:migrate --env development --config ./src/Database/Config/config.js --migrations-path ./src/Database/Migrations
// npx sequelize-cli db:migrate:undo --env development --config ./src/Database/Config/config.js --migrations-path ./src/Database/Migrations