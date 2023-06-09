/** @format */

/* This code is importing the AWS SDK (Software Development Kit) module, which provides access to Amazon Web Services, such as databases, storage, and other services. The AWS SDK allows developers to build applications that use the AWS cloud platform. */
const AWS = require("aws-sdk");
require("dotenv").config();
/* This code is requiring the Expense Model from the models folder in order to use it in the current file. This allows access to the data and functions associated with the Expense Model. */
const Expense = require("../models/ExpenseModel"); // Import your Sequelize Expense model
/* This code is requiring the Express library in order to create a web application. Express is a web application framework for Node.js, providing a robust set of features for building web applications and APIs. */
const express = require("express");
/* This code is requiring a FileUrlModel from the models folder. This model contains the URL of a file, which will be used in the code. */
const FileURL = require("../models/FileUrlModel");
/* This code creates a router object for the Amazon S3 service using the Express library. The router object will allow for routing of requests and responses to and from the Amazon S3 service. */
const amazons3Router = express.Router();
const sequelize = require("../database/Database");

// Configure AWS SDK with your credentials
AWS.config.update({
	accessKeyId: process.env.accessKeyId,
	secretAccessKey: process.env.secretAccessKey,
});

// Create a new instance of the S3 service
/* This code creates a new instance of an Amazon Web Services (AWS) S3 object, which is used for storing and retrieving data from the cloud. */
const s3 = new AWS.S3();

// Define your route for file upload
amazons3Router.post("/upload/:userId", async (req, res) => {
	/* This code is retrieving the userId parameter from an HTTP request and assigning it to the constant variable userId. */
	const userId = req.params.userId;

	// need to do the sequelize transaction so that if any error occurs during api calls then that should not get reflected in the database
	/* This code creates a transaction using the Sequelize library, which allows the code to execute a series of database operations as a single atomic unit. This ensures that all operations either complete successfully, or none of them are applied if any of them fail. */
	const transaction = await sequelize.transaction();

	try {
		// Fetch expenses from the database based on user ID
		/* This code is retrieving all expenses from a database where the userId matches the userId provided. */
		const expenses = await Expense.findAll({
			where: { userId },
		});

		// Convert expenses to text
		/* This statement uses the JSON.stringify() method to convert a JavaScript object (expenses) into a string. This allows the object to be stored and transferred as a string, rather than a complex object. */
		const textData = JSON.stringify(expenses);

		// Set up the S3 parameters
		/* This code is creating a parameter object for an API call. The parameter object includes the bucket name, a key that is generated from the user ID and a random number, and the body of the call, which is the text data. */
		const params = {
			Bucket: "expensetracker1995",
			Key: `expenses_${userId}.${Math.floor(Math.random() * 100000)}.txt`,
			Body: textData,
		};

		// Upload the file to S3
		/* This code is creating a new Promise, which will resolve with the data returned from an S3 upload. The Promise will reject if there is an error with the upload. */
		const s3Data = await new Promise((resolve, reject) => {
			s3.upload(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});

		// File uploaded successfully
		// after successful upload of the file we need to save that link into the database
		/* This code is creating a file URL object with the specified URL and user ID, and then saving it to the database using a transaction. */
		const fileUrl = await FileURL.create({
			url: s3Data.Location,
			UserId: userId,
		});

		await transaction.commit();
		res.json({ message: "File uploaded to S3", urlLink: s3Data.Location });
	} catch (error) {
		await transaction.rollback();
		return res.json({
			error: "Failed to fetch expenses from the database or upload file to S3",
		});
	}
});

module.exports = amazons3Router;
