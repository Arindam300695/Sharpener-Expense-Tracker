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
	console.log(userId);

	try {
		const amount = 2500;
		const options = {
			amount,
			currency: "INR",
		};
		const order = await razorpay.orders.create(options);

		// creating a new order in order to save that in the databse with default status pending
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
			// finding the order which is supposed to be updated
			const orderToBeUpdated = await Order.findOne({
				where: { orderId: razorpay_order_id },
			});
			// now updating the order status from pending to successful/completed
			await orderToBeUpdated.update({
				paymentId: razorpay_payment_id,
				status: "completed",
			});
			// now finding the same updated order so that now we can send that order as response to the frontend to perform preferred operations there
			const order = await Order.findOne({
				where: { orderId: razorpay_order_id },
			});
			// as that order will contain the respective user id so based on that user id finding the user so that we can also update the user's payment status and can save that to localstorage on the front end side in order to show respective changes whenever that user will login
			const user = await User.findOne({ where: { id: order.UserId } });

			// sending the user and his/her payment status as response to the front end
			res.send({
				message: "Payment completed successfully",
				userWithOrderStatus: {
					id: user.id,
					name: user.name,
					email: user.email,
					totalExpenses: user.totalExpenses,
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
	const { orderId, paymentId } = req.body;

	// if the payment got failed or rejected then need to update the status of that specific order as failed so for that only first need to find that specific order
	const orderToBeUpdated = await Order.findOne({
		where: { orderId },
	});
	// now after finding that order we are updating the status of the order as failed
	await orderToBeUpdated.update({
		paymentId,
		status: "failed",
	});
	return res.json({ error: "Payment Failed" });
});

module.exports = paymentRouter;
