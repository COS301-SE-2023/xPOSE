/*require('dotenv').config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize({ 
    dialect: "mysql",
    host: process.env.HOST,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.PORT_NUMBER

});

module.exports = sequelize;
*/

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.PORT_NUMBER
});

export default sequelize;
