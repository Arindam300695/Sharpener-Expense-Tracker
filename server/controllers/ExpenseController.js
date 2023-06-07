/** @format */

const Expense = require("../models/ExpenseModel");
const User = require("../models/UserModel");

// get user specific expense contorller
const getExpensesController = async (req, res) => {
	const { userId } = req.params;

	try {
		const expenses = await Expense.findAll({
			where: { UserId: userId },
			attributes: ["id", "amount", "description", "category"],
		});

		res.json({ message: "expenses fetched successfullyfd", expenses });
	} catch (error) {
		res.json({ error: error.message });
	}
};

// add expense controller
const addExpenseController = async (req, res) => {
	const { amount, description, category, userId } = req.body;
	console.log(amount, description, category, userId);
	try {
		const expense = await Expense.create({
			amount,
			description,
			category,
			UserId: userId,
		});
		const user = await User.findOne({
			where: { id: userId },
			attributes: ["id", "email", "name", "totalExpenses"],
		});
		await user.update({
			totalExpenses: (user.totalExpenses += Number(expense.amount)),
		});

		res.json({ message: "expense created successfully", expense, user });
	} catch (error) {
		res.json({ error: error.message });
	}
};

// delete expense controller
const deleteExpenseController = async (req, res) => {
	const { id, userId } = req.params;

	try {
		const deletedExpense = await Expense.findByPk(id);
		const user = await User.findOne({
			where: { id: userId },
			attributes: ["id", "email", "name", "totalExpenses"],
		});
		await user.update({
			totalExpenses: (user.totalExpenses -= Number(
				deletedExpense.amount,
			)),
		});
		await deletedExpense.destroy();
		res.json({ message: "expense deleted successfully", user });
	} catch (error) {
		res.json({ error: error.message });
	}
};

module.exports = {
	addExpenseController,
	getExpensesController,
	deleteExpenseController,
};
