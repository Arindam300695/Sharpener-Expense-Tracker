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
const leaderboardRouter = require("./routes/LeaderBoardRouter");
const passWordResetRouter = require("./routes/PasswordRestRouter");
const ForgotPasswordRequest = require("./models/ForgetPasswordRequestsMode");
const amazons3Router = require("./amazon s3/s3Intrgration");
const FileURL = require("./models/FileUrlModel");
const helmet = require("helmet");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, "access.log"),
	{ flags: "a" },
);

// injecting express middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

// setting up relation between user and expense model
// Define the associations

Expense.belongsTo(User);

// Defining the realtion between the user and the order model
Order.belongsTo(User);

// defining the relation between the forget password model and the user model
ForgotPasswordRequest.belongsTo(User);

// defining the relation between the fileurl model and the user model
FileURL.belongsTo(User);

// Synchronize the model with the database
sequelize
	.sync({})
	.then(() => {
		console.log("Database synchronized.");
	})
	.catch((error) => {
		console.error("Unable to synchronize the database:", error);
	});

// Routes

// Auth routes
app.use("/api/users", authRouter);
// Expense routes
app.use("/api/expense", expenseRouter);
// Payment routes
app.use("/api/payment", paymentRouter);
// leaderboard routes
app.use("/api/leaderboard", leaderboardRouter);
// password reset routes
app.use("/api/passwordReset", passWordResetRouter);
// amazon s3 routes
app.use("/api/amazonS3", amazons3Router);
// previousreports routes
app.get("/api/previousReports/:userId", async (req, res) => {
	const { userId } = req.params;
	const allReportsData = await FileURL.findAll({
		where: { ExpenseUserId: userId },
	});
	res.send({ message: "hello from previous reports server", allReportsData });
});

// Start the server
app.listen(process.env.PORT || 8080, () => {
	console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
