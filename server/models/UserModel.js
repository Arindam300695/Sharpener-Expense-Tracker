/** @format */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/Database");

const User = sequelize.define("User", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	totalExpenses: {
		type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 0,
	},
});

module.exports = User;
