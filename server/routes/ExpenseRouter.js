/** @format */

const express = require("express");
const {
	addExpenseController,
	getExpensesController,
	deleteExpenseController,
	getAllExpensesController,
} = require("../controllers/ExpenseController");

const expenseRouter = express.Router();

expenseRouter.post("/createExpense", addExpenseController);
expenseRouter.get("/getExpenses/:userId", getExpensesController);
expenseRouter.get("/getAllExpenses", getAllExpensesController);
expenseRouter.delete("/deleteExpenses/:id/:userId", deleteExpenseController);

module.exports = expenseRouter;
