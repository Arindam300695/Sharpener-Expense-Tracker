/** @format */

const express = require("express");
const paymentRouter = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
require("dotenv").config();

const razorpay = new Razorpay({
	key_id: process.env.key_id,
	key_secret: process.env.key_secret,
});

// route for getting razorpay key in the frontend
paymentRouter.get("/key", async (req, res) => {
	res.send({ key: process.env.key_id });
});

// route for crating an order
paymentRouter.post("/order", async (req, res) => {
	const { userId } = req.body;

	try {
		const amount = 1500;

		const options = {
			amount,
			currency: "INR",
		};

		const isAlreadyPremiumMember = await Order.findAll({
			where: { userId },
		});

		if (isAlreadyPremiumMember) {
			for (let i = 0; i < isAlreadyPremiumMember.length; i++) {
				if (isAlreadyPremiumMember[i].status === "completed")
					return res.json({ error: "Alrady a premium member" });
			}
		}

		const order = await razorpay.orders.create(options);

		if (order) {
			await Order.create({
				paymentId: "",
				orderId: order.id,
				UserId: userId,
			});
			return res.json({
				message: "Payment initiated",
				orderId: order.id,
				amount: order.amount,
			});
		}
	} catch (error) {
		res.json({ error: "Failed to initiate payment" });
	}
});

// route for verifying the payment
paymentRouter.post("/verify", async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;

		const body = razorpay_order_id + "|" + razorpay_payment_id;

		var expectedSignature = crypto
			.createHmac("sha256", process.env.key_secret)
			.update(body.toString())
			.digest("hex");

		const isAuthenticated = expectedSignature === razorpay_signature;
		if (isAuthenticated) {
			const orderToBeUpdated = await Order.findOne({
				where: { orderId: razorpay_order_id },
			});
			await orderToBeUpdated.update({
				paymentId: razorpay_payment_id,
				status: "completed",
			});
			const order = await Order.findOne({
				where: { orderId: razorpay_order_id },
			});
			const user = await User.findOne({ where: { id: order.UserId } });

			res.send({
				message: "Payment completed successfully",
				userWithOrderStatus: {
					id: user.id,
					name: user.name,
					email: user.email,
					orderId: order.orderId,
					paymentId: order.paymentId,
					status: order.status,
				},
			});
		} else {
			res.json({ error: "Not Authenticated" });
		}
	} catch (error) {
		return res.json({ error: error.message });
	}
});

// route for handeling payment failed
paymentRouter.post("/paymentFailed", async (req, res) => {
	const { userId, orderId, paymentId } = req.body;

	const orderToBeUpdated = await Order.findOne({
		where: { orderId },
	});
	orderToBeUpdated.update({
		paymentId,
		status: "failed",
	});
	return res.json({ error: "Payment Failed" });
});

module.exports = paymentRouter;
