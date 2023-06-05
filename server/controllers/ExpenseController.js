/** @format */

const Expense = require("../models/ExpenseModel");

// add expense controller
const addExpenseController = async (req, res) => {
	const { amount, description, category, userId } = req.body;

	try {
		const expense = await Expense.create({
			amount,
			description,
			category,
			UserId: userId,
		});
		res.json({
			message: "expense created and added to databse successfully",
			expense,
		});
	} catch (error) {
		res.json({ error: "Failed to add expense" });
	}
};

// get expense contorller
const getExpensesController = async (req, res) => {
	const { userId } = req.params;

	try {
		const expenses = await Expense.findAll({ where: { UserId: userId } });

		res.json({ message: "expenses fetched successfully", expenses });
	} catch (error) {
		res.json({ error: "Failed to fetch expenses" });
	}
};

// delete expense controller
const deleteExpenseController = async (req, res) => {
	const { id, userId } = req.params;

	try {
		const deletedExpense = await Expense.destroy({
			where: { id, UserId: userId },
		});

		if (deletedExpense) {
			res.json({ message: "expense deleted successfully!" });
		} else {
			res.json({ error: "Expense not found" });
		}
	} catch (error) {
		res.json({ error: "Failed to delete expense" });
	}
};

module.exports = {
	addExpenseController,
	getExpensesController,
	deleteExpenseController,
};
