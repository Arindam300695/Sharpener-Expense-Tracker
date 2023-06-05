/** @format */

const express = require("express");
const {
	addExpenseController,
	getExpensesController,
	deleteExpenseController,
} = require("../controllers/ExpenseController");

const expenseRouter = express.Router();

expenseRouter.post("/createExpense", addExpenseController);
expenseRouter.get("/getExpenses", getExpensesController);
expenseRouter.delete("/deleteExpenses/:id", deleteExpenseController);

module.exports = expenseRouter;
