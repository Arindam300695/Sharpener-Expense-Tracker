/** @format */

const express = require("express");
const sequelize = require("./database/Database");
const authRouter = require("./routes/AuthRouter");

const app = express();
const PORT = 3000;

// Synchronize the model with the database
sequelize
	.sync()
	.then(() => {
		console.log("Database synchronized.");
	})
	.catch((error) => {
		console.error("Unable to synchronize the database:", error);
	});

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", authRouter);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
