/** @format */

const express = require("express");
const User = require("../models/UserModel");
const leaderboardRouter = express.Router();

leaderboardRouter.get("/", async (req, res) => {
	try {
		const totalExpenses = await User.findAll({
			attributes: ["id", "totalExpenses", "name"],
		});
		res.json(totalExpenses);
	} catch (error) {
		return res.json({ error: error.message });
	}
});

module.exports = leaderboardRouter;
