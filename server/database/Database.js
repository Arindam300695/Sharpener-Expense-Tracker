/** @format */

const { Sequelize } = require("sequelize");
require("dotenv").config();

/* This code creates a new instance of Sequelize, which is an open-source Node.js ORM (Object-Relational Mapping) for working with relational databases. It takes four arguments: the name of the database, the user name, the password, and an object containing the host and dialect of the database. In this case, the database is a MySQL database. */
const sequelize = new Sequelize(process.env.db_uri);

module.exports = sequelize;
