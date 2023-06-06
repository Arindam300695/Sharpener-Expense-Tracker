/** @format */

const { DataTypes } = require("sequelize");
const sequelize = require("../database/Database");

const Order = sequelize.define("Order", {
	paymentId: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	orderId: {
		type: DataTypes.STRING,
	},
	status: {
		type: DataTypes.STRING,
		defaultValue: "pending",
	},
});

module.exports = Order;
