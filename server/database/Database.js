/** @format */

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Replace the following placeholders with your actual database credentials
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST; // Replace with your MySQL database server hostname or IP address

// Create a new Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "mysql",
});

module.exports = sequelize;
