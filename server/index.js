/** @format */

const express = require("express");
const cors = require("cors");
const sequelize = require("./database/Database");
const authRouter = require("./routes/AuthRouter");
const expenseRouter = require("./routes/ExpenseRouter");
const User = require("./models/UserModel");
const Expense = require("./models/ExpenseModel");
const paymentRouter = require("./routes/PaymentRouter");
const Order = require("./models/OrderModel");

const app = express();
const PORT = 8080;

// injecting express middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting up relation between user and expense model
// Define the associations
User.hasMany(Expense);
Expense.belongsTo(User);

// Defining the realtion between the user and the order model
Order.belongsTo(User);

// Synchronize the model with the database
sequelize
	.sync({})
	.then(() => {
		console.log("Database synchronized.");
	})
	.catch((error) => {
		console.error("Unable to synchronize the database:", error);
	});

// Middleware
app.use(express.json());

// Routes

// Auth routes
app.use("/api/users", authRouter);
// Expense routes
app.use("/api/expense", expenseRouter);
// Payment routes
app.use("/api/payment", paymentRouter);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
