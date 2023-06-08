/** @format */

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:8080";

const DailyExpense = () => {
	const navigate = useNavigate();

	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [expenses, setExpenses] = useState([]);
	const [user, setUser] = useState({});
	const [totalExpense, setTotalExpense] = useState([]);
	const [rows, setRows] = useState([]);
	const [yearlyReports, setYearlyReports] = useState([]);
	const [notes, setNotes] = useState([]);

	const calculateTotal = () => {
		const totalIncome = rows.reduce(
			(total, row) => total + (row.income || 0),
			0,
		);
		const totalExpense = rows.reduce(
			(total, row) => total + (row.expense || 0),
			0,
		);
		return totalIncome - totalExpense;
	};

	useEffect(() => {
		const localStorageUser = JSON.parse(localStorage.getItem("user"));
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
		const fetcheLeaderBoardData = async () => {
			try {
				const { data } = await axios.get(`${baseUrl}/api/leaderboard`); // Replace with your API endpoint
				const sortedData = data.sort(
					(a, b) => b.totalExpenses - a.totalExpenses,
				);
				setTotalExpense(sortedData);
			} catch (error) {
				toast.error(error.message);
			}
		};

		fetcheLeaderBoardData();

		// fetching the report data
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"https://api.example.com/data",
				);
				setRows(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Error fetching data");
			}
		};

		fetchData();

		// fetching the yearly report data
		const fetchYearlyReports = async () => {
			try {
				const response = await axios.get(
					"https://api.example.com/yearly-reports",
				);
				setYearlyReports(response.data);
			} catch (error) {
				console.error("Error fetching yearly reports:", error);
				toast.error("Error fetching yearly reports");
			}
		};

		fetchYearlyReports();

		// fetching the yearly notes based data
		const fetchNotes = async () => {
			try {
				const response = await axios.get(
					"https://api.example.com/notes?year=2023",
				);
				setNotes(response.data);
			} catch (error) {
				console.error("Error fetching notes:", error);
				toast.error("Error fetching notes");
			}
		};

		fetchNotes();
	}, [user.id]);

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
			setExpenses((prevExpenses) => [
				...prevExpenses,
				{ amount, description, category },
			]);

			// writing the logic to sort the total expense of each user whenever the logged in user will create or add a new expense
			const userTotalExpense = [
				...totalExpense.filter((item) => item.id !== user.id),
				...totalExpense.filter(
					(item) =>
						item.id === user.id &&
						(item.totalExpenses += Number(data.expense.amount)),
				),
			];
			const sortedUserTotalExpense = userTotalExpense.sort(
				(a, b) => b.totalExpenses - a.totalExpenses,
			);
			setTotalExpense(sortedUserTotalExpense);
			// const sortedUserTotalExpense = userTotalExpense.sort((a,b)=>b.)
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Handle expense deletion
	const handleDeleteExpense = async (expenseId, expenseAmount) => {
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
			const userTotalExpense = [
				...totalExpense.filter((item) => item.id !== user.id),
				...totalExpense.filter(
					(item) =>
						item.id === user.id &&
						(item.totalExpenses -= Number(expenseAmount)),
				),
			];
			const sortedUserTotalExpense = userTotalExpense.sort(
				(a, b) => b.totalExpenses - a.totalExpenses,
			);
			setTotalExpense(sortedUserTotalExpense);
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
			image: "https://example.com/your_logo",
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
				color: "#3399cc",
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

				<div className="m-auto w-60">
					{/* premium membership button */}
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

				<h1 className="mb-4 text-2xl font-bold">
					Daily Expense Table of {user.name}{" "}
				</h1>
				{/* Expense table */}
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
							{expenses.map((expense, index) => (
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
													expense.amount,
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

				{/* leader board only for premium users */}
				<div className="container px-4 py-8 mx-auto">
					<h1 className="mb-4 text-2xl font-bold">Leaderboard</h1>
					{/* Leaderboard table */}
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

				{/* report data only for premium members */}
				<div>
					<h1 className="text-xl font-bold">
						Day to Day Expenses report
					</h1>
					<table className="table-auto">
						<thead>
							<tr>
								<th className="px-4 py-2">Date</th>
								<th className="px-4 py-2">Description</th>
								<th className="px-4 py-2">Category</th>
								<th className="px-4 py-2">Income</th>
								<th className="px-4 py-2">Expense</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, index) => (
								<motion.tr
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									<td className="px-4 py-2 border">
										{row.date}
									</td>
									<td className="px-4 py-2 border">
										{row.description}
									</td>
									<td className="px-4 py-2 border">
										{row.category}
									</td>
									<td className="px-4 py-2 border">
										{row.income}
									</td>
									<td className="px-4 py-2 border">
										{row.expense}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
					<div className="mt-4">
						<strong>Total:</strong> {calculateTotal()}
					</div>
				</div>

				{/* yearly report data only for premium members */}
				<div>
					<h1 className="text-xl font-bold">Yearly Report</h1>
					<table className="table-auto">
						<thead>
							<tr>
								<th className="px-4 py-2">Month</th>
								<th className="px-4 py-2">Income</th>
								<th className="px-4 py-2">Expense</th>
								<th className="px-4 py-2">Savings</th>
							</tr>
						</thead>
						<tbody>
							{yearlyReports.map((report, index) => (
								<motion.tr
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									<td className="px-4 py-2 border">
										{report.month}
									</td>
									<td className="px-4 py-2 border">
										{report.income}
									</td>
									<td className="px-4 py-2 border">
										{report.expense}
									</td>
									<td className="px-4 py-2 border">
										{report.savings}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>

				{/* yearly notes report data only for premium members */}
				<div>
					<h1 className="text-xl font-bold">Notes Report</h1>
					<table className="table-auto">
						<thead>
							<tr>
								<th className="px-4 py-2">Date</th>
								<th className="px-4 py-2">Notes</th>
							</tr>
						</thead>
						<tbody>
							{notes.map((note, index) => (
								<motion.tr
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									<td className="px-4 py-2 border">
										{note.date}
									</td>
									<td className="px-4 py-2 border">
										{note.text}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default DailyExpense;
