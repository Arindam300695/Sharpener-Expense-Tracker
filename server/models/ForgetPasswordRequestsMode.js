/** @format */

const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../database/Database");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
	id: {
		type: DataTypes.UUID,
		defaultValue: () => uuidv4(),
		primaryKey: true,
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	otp: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

module.exports = ForgotPasswordRequest;
