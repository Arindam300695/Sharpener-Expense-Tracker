/** @format */

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

const baseUrl = "https://expense-tracker-1o1h.onrender.com";

const DailyExpense = () => {
	const navigate = useNavigate();

	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [expenses, setExpenses] = useState([]);
	const [user, setUser] = useState({});
	const [totalExpense, setTotalExpense] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [expensesPerPage, setExpensesPerPage] = useState(() => {
		const storedPerPage = localStorage.getItem("expensesPerPage");
		return storedPerPage ? parseInt(storedPerPage) : 5; // Set a default value of 10 if no preference is found
	});

	const handleExpensesPerPageChange = (event) => {
		const perPage = parseInt(event.target.value);
		setExpensesPerPage(perPage);
		localStorage.setItem("expensesPerPage", perPage.toString());
	};

	useEffect(() => {
		const localStorageUser = JSON.parse(localStorage.getItem("user"));
		if (localStorageUser == null) navigate("/");
		if (localStorageUser !== null) setUser(localStorageUser);

		// Fetch user-specific expenses
		const fetchExpenses = async () => {
			try {
				const { data } = await axios.get(
					`${baseUrl}/api/expense/getExpenses/${localStorageUser.id}`,
				); // Replace with your API endpoint
				if (data.error) return toast.error(data.error);

				setExpenses(data.expenses);
			} catch (error) {
				toast.error(error.message);
			}
		};
		fetchExpenses();

		// fetching the leaderboard data
		fetcheLeaderBoardData();
	}, [user.id, navigate]);

	// fetching the leaderboard data
	const fetcheLeaderBoardData = async () => {
		try {
			const { data } = await axios.get(`${baseUrl}/api/leaderboard`); // Replace with your API endpoint

			const sortedData = data?.sort(
				(a, b) => b.totalExpenses - a.totalExpenses,
			);
			setTotalExpense(sortedData);
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Handle expense submission
	const handleAddExpense = async (e) => {
		e.preventDefault();

		try {
			// Send API request to add expense
			const { data } = await axios.post(
				`${baseUrl}/api/expense/createExpense`,
				{
					amount,
					description,
					category,
					userId: user.id,
				},
			);

			localStorage.setItem(
				"user",
				JSON.stringify({
					...JSON.parse(localStorage.getItem("user")),
					totalExpenses: data.user.totalExpenses,
				}),
			);

			if (data.error) return toast.error(data.error);
			toast.success(data.message);

			// Clear input fields and update expenses
			setAmount("");
			setDescription("");
			setCategory("");
			setExpenses((prev) => [...prev, data.expense]);

			// writing the logic to sort the total expense of each user whenever the logged in user will create or add a new expense
			fetcheLeaderBoardData();
			// const sortedUserTotalExpense = userTotalExpense.sort((a,b)=>b.)
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Handle expense deletion
	const handleDeleteExpense = async (expenseId) => {
		try {
			// Send API request to delete expense
			const { data } = await axios.delete(
				`${baseUrl}/api/expense/deleteExpenses/${expenseId}/${user.id}`,
			);

			localStorage.setItem(
				"user",
				JSON.stringify({
					...JSON.parse(localStorage.getItem("user")),
					totalExpenses: data.user.totalExpenses,
				}),
			);

			if (data.error) return toast.error(data.error);
			toast.success(data.message);

			// Update expenses
			setExpenses((prevExpenses) =>
				prevExpenses.filter((expense) => expense.id !== expenseId),
			);

			// writing the logic to sort total expense of each user whenever the logged in user will delete any expense
			fetcheLeaderBoardData();
		} catch (error) {
			toast.error(error.message);
		}
	};

	// handle buy premium functionality
	const handleBuyPremium = async () => {
		//fetching the razorpay key
		const {
			data: { key },
		} = await axios.get(`${baseUrl}/api/payment/key`);

		// sending the post request to create a new payment order
		const {
			data: { orderId, amount },
		} = await axios.post(`${baseUrl}/api/payment/order`, {
			userId: user.id,
		});

		var options = {
			key, // Enter the Key ID generated from the Dashboard
			amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			currency: "INR",
			name: "Mystic Coder",
			description: "Test Transaction",
			image: "data:image/png;base64,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",
			order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

			// handler function to perform the logic if the payment will be completed successfully
			handler: async (response) => {
				const { data } = await axios.post(
					`${baseUrl}/api/payment/verify`,
					{
						razorpay_order_id: response.razorpay_order_id,
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_signature: response.razorpay_signature,
					},
				);
				if (data.error) return toast.error(data.error);
				if (data.message) {
					localStorage.setItem(
						"user",
						JSON.stringify(data.userWithOrderStatus),
					);
					navigate("/paymentSuccess");
				}
			},
			prefill: {
				name: user.name,
				email: user.email,
				contact: "9000090000",
			},
			notes: {
				address: "Razorpay Corporate Office",
			},
			theme: {
				color: "#6F1E51",
			},
		};

		var razorpay = new window.Razorpay(options);
		razorpay.on("payment.failed", async (response) => {
			const { data } = await axios.post(
				`${baseUrl}/api/payment/paymentFailed`,
				{
					orderId: response.error.metadata.order_id,
					paymentId: response.error.metadata.payment_id,
				},
			);
			if (data.error) {
				navigate("/paymentFailed");
				toast.error(data.error);
			}
		});

		razorpay.open();
	};

	// time formatting function
	const formatDate = (createdDate) => {
		const formattedDate = moment(createdDate).format("DD MMM YYYY"); // Example format: 09 Jun 2023
		return formattedDate;
	};

	// report downalod handler function
	const reportDownloadHandler = async (event) => {
		event.preventDefault();

		try {
			// Upload the file if no file location is available
			const uploadResponse = await axios.post(
				`${baseUrl}/api/amazonS3/upload/${user.id}`,
			);

			const link = document.createElement("a");
			link.href = uploadResponse.data.urlLink;
			link.setAttribute("download", "file.txt");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const indexOfLastExpense = currentPage * expensesPerPage;
	const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
	const currentExpenses = expenses.slice(
		indexOfFirstExpense,
		indexOfLastExpense,
	);

	// Handle pagination: Go to the next page
	const nextPage = () => {
		if (currentPage < Math.ceil(expenses.length / expensesPerPage)) {
			setCurrentPage(currentPage + 1);
		}
	};

	// Handle pagination: Go to the previous page
	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<>
			<Navbar />
			<div className="container px-4 py-8 mx-auto">
				<h1 className="mb-4 text-2xl font-bold">Daily Expense</h1>

				{/* Expense form */}
				<form className="mb-4" onSubmit={handleAddExpense}>
					<div className="flex items-center mb-2">
						<label className="mr-2">Amount:</label>
						<input
							type="number"
							step="0.01"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
							className="px-2 py-1 border border-gray-300 rounded"
						/>
					</div>
					<div className="flex items-center mb-2">
						<label className="mr-2">Description:</label>
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							className="px-2 py-1 border border-gray-300 rounded"
						/>
					</div>
					<div className="flex items-center mb-4">
						<label className="mr-2">Category:</label>
						<input
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							required
							className="px-2 py-1 border border-gray-300 rounded"
						/>
					</div>
					<button
						type="submit"
						className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
					>
						Add Expense
					</button>
				</form>

				{/* premium membership button */}
				<div className="m-auto w-60">
					<button
						className={`p-3 border border-black animate-bounce hover:bg-black hover:text-white transition-all duration-300 rounded-[10rem] bg-teal-300 font-semibold text-[#1B1464] ${
							user?.status === "completed" && "hidden"
						}`}
						onClick={handleBuyPremium}
					>
						Become a Premium Member
					</button>
				</div>
				<div className="w-64 m-auto">
					<h1
						className={`bg-purple-500 rounded-lg hover:scale-110 p-3 hover:cursor-pointer transition-all duration-300 text-white font-bold ${
							user?.status !== "completed" && "hidden"
						}`}
					>
						You Are now a Premium User
					</h1>
				</div>

				{/* daily expense table */}
				<h1 className="mb-4 text-2xl font-bold">
					Daily Expense Table of {user.name}{" "}
				</h1>
				{/* Expense table */}
				<div>
					<table className="w-full">
						<thead>
							<tr>
								<th className="text-left">Amount</th>
								<th className="text-left">Description</th>
								<th className="text-left">Category</th>
								<th className="text-left">Action</th>
							</tr>
						</thead>
						<tbody>
							<AnimatePresence>
								{currentExpenses.map((expense, index) => (
									<motion.tr
										key={index}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.3 }}
									>
										<td>{expense.amount}</td>
										<td>{expense.description}</td>
										<td>{expense.category}</td>
										<td>
											<button
												onClick={() =>
													handleDeleteExpense(
														expense.id,
													)
												}
												className="font-bold text-red-500 hover:text-red-700"
											>
												Delete
											</button>
										</td>
									</motion.tr>
								))}
							</AnimatePresence>
						</tbody>
					</table>

					{/* giving the user the option to set how many expenses per page he/she wants to see */}
					<div className="m-auto mt-4 w-80">
						<label
							htmlFor="expensesPerPage"
							className="font-semibold"
						>
							Expenses per Page:
						</label>
						<select
							id="expensesPerPage"
							value={expensesPerPage}
							onChange={handleExpensesPerPageChange}
							className="bg-red-400"
						>
							<option value="5">5</option>
							<option value="8">8</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="40">40</option>
						</select>
					</div>
					{/* Pagination controls */}
					<div className="flex justify-between">
						<button
							onClick={prevPage}
							disabled={currentPage === 1}
							className="p-3 m-2 font-semibold transition-all duration-300 bg-red-400 rounded-md cursor-pointer hover:bg-red-500"
						>
							Previous Page
						</button>
						<button
							onClick={nextPage}
							disabled={
								currentPage ===
								Math.ceil(expenses.length / expensesPerPage)
							}
							className="p-3 m-2 font-semibold transition-all duration-300 bg-green-400 rounded-md cursor-pointer hover:bg-green-500"
						>
							Next Page
						</button>
					</div>

					{/* Display the total number of expenses and the last page */}
					<div className="flex justify-center gap-4">
						<h1>Total Expenses: {expenses.length}</h1>
						<h1>
							{" "}
							Last Page:{" "}
							{Math.ceil(expenses.length / expensesPerPage)}
						</h1>
					</div>
				</div>

				{/* leader board only for premium users */}
				<div
					className={`container px-4 py-8 mx-auto ${
						user?.status !== "completed" && "hidden"
					}`}
				>
					<h1 className="mb-4 text-2xl font-bold">Leaderboard</h1>
					<table className="w-full">
						<thead>
							<tr>
								<th className="text-left">Total Amount</th>
								<th className="text-left">User Name</th>
							</tr>
						</thead>
						<tbody>
							<AnimatePresence>
								{totalExpense.map((user) => (
									<motion.tr
										key={user.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ duration: 0.3 }}
									>
										<td>{user.totalExpenses}</td>
										<td>{user.name}</td>
									</motion.tr>
								))}
							</AnimatePresence>
						</tbody>
					</table>
				</div>

				{/*  report generation only for premium users */}
				<div className="m-auto w-80">
					{/* report download button */}
					<button
						className={`p-3 border-4 font-bold border-black animate-bounce hover:bg-black hover:text-white transition-all duration-300 rounded-[10rem] bg-teal-300  text-[#1B1464] ${
							user?.status !== "completed" && "hidden"
						}`}
						onClick={(event) => {
							reportDownloadHandler(event);
						}}
					>
						Download detailed report
					</button>

					<h1
						className={`p-2 m-4 text-center rounded-md bg-violet-400 w-60 ${
							user?.status !== "completed" && "hidden"
						}`}
					>
						{" "}
						<Link
							to="/previousReports"
							className={`mt-4 font-semibold ${
								user?.status !== "completed" && "hidden"
							}`}
						>
							Show me my previous report links list
						</Link>
					</h1>
				</div>

				<div
					className={`mt-4 mb-4 ${
						user?.status !== "completed" && "hidden"
					}`}
				>
					<h1 className={"mb-4 text-2xl font-bold"}>
						Detailed Report of {user.name}
					</h1>

					<table className="w-full">
						<thead>
							<tr>
								<th className="text-left">Date</th>
								<th className="text-left">Amount</th>
								<th className="text-left">Description</th>
								<th className="text-left">Category</th>
							</tr>
						</thead>
						<tbody>
							<AnimatePresence>
								{expenses.map((expense, index) => (
									<motion.tr
										key={index}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.3 }}
									>
										<td>{formatDate(expense.createdAt)}</td>
										<td>{expense.amount}</td>
										<td>{expense.description}</td>
										<td>{expense.category}</td>
									</motion.tr>
								))}
							</AnimatePresence>
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default DailyExpense;
