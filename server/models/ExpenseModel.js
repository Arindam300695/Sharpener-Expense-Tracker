/** @format */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/Database");

// Define the Expense model
const Expense = sequelize.define("Expense", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	amount: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	category: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = Expense;
