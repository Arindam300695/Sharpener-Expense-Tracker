/** @format */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/Database");

const FileURL = sequelize.define("FileUrl", {
	url: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = FileURL;
