/** @format */

const { Sequelize } = require("sequelize");
require("dotenv").config();

/* This code is retrieving the value of a variable called 'DB_NAME' from an environment variable. Environment variables are key-value pairs that can be used to store information such as user settings, system paths, and other configuration details. The value of the 'DB_NAME' variable will be used in the code that follows. */
const DB_NAME = process.env.DB_NAME;
/* This code is retrieving the value of the environment variable named "DB_USER" and assigning it to the constant "DB_USER". */
const DB_USER = process.env.DB_USER;
/* This code retrieves the value of the environment variable DB_PASSWORD and assigns it to the constant DB_PASSWORD. */
const DB_PASSWORD = process.env.DB_PASSWORD;
/* This code is setting the value of the constant DB_HOST to the value of the environment variable DB_HOST. This allows the code to access the host address of the database from the environment variable. */
const DB_HOST = process.env.DB_HOST;

/* This code creates a new instance of Sequelize, which is an open-source Node.js ORM (Object-Relational Mapping) for working with relational databases. It takes four arguments: the name of the database, the user name, the password, and an object containing the host and dialect of the database. In this case, the database is a MySQL database. */
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "mysql",
});

module.exports = sequelize;
