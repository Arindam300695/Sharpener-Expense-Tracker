/** @format */

const Expense = require("../models/ExpenseModel");
const User = require("../models/UserModel");
const sequelize = require("../database/Database");

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
	// need to do the sequelize transaction so that if any error occurs during api calls then that should not get reflected in the database
	const transaction = await sequelize.transaction();

	const { amount, description, category, userId } = req.body;
	console.log(amount, description, category, userId);
	try {
		const expense = await Expense.create(
			{
				amount,
				description,
				category,
				UserId: userId,
			},
			{ transaction },
		);
		const user = await User.findOne({
			where: { id: userId },
			attributes: ["id", "email", "name", "totalExpenses"],
		});
		await user.update(
			{
				totalExpenses: (user.totalExpenses += Number(expense.amount)),
			},
			{ transaction },
		);
		await transaction.commit();
		res.json({ message: "expense created successfully", expense, user });
	} catch (error) {
		await transaction.rollback();
		res.json({ error: error.message });
	}
};

// delete expense controller
const deleteExpenseController = async (req, res) => {
	// need to do the sequelize transaction so that if any error occurs during api calls then that should not get reflected in the database
	const transaction = await sequelize.transaction();

	const { id, userId } = req.params;

	try {
		const deletedExpense = await Expense.findByPk(id);
		const user = await User.findOne({
			where: { id: userId },
			attributes: ["id", "email", "name", "totalExpenses"],
		});
		await user.update(
			{
				totalExpenses: (user.totalExpenses -= Number(
					deletedExpense.amount,
				)),
			},
			{ transaction },
		);
		await deletedExpense.destroy({ transaction });
		await transaction.commit();
		res.json({ message: "expense deleted successfully", user });
	} catch (error) {
		await transaction.rollback();
		res.json({ error: error.message });
	}
};

module.exports = {
	addExpenseController,
	getExpensesController,
	deleteExpenseController,
};
