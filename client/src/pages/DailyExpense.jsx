/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:8080";

const DailyExpense = () => {
	const navigate = useNavigate("/");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [otherCategory, setOtherCategory] = useState("");
	const [expenses, setExpenses] = useState([]);
	const [userId, setUserId] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userName, setUserName] = useState("");
	const [user, setUser] = useState({});
	const [allExpenses, setAllExpenses] = useState([]);

	useEffect(() => {
		const localStorageUser = JSON.parse(localStorage.getItem("user"));
		if (localStorageUser !== null) {
			setUser(localStorageUser);
			setUserId(localStorageUser.id);
			setUserEmail(localStorageUser.email);
			setUserName(localStorageUser.name);
		}

		const fetchExpenses = async () => {
			try {
				const response = await axios.get(
					`${baseUrl}/api/expense/getExpenses/${localStorageUser.id}`,
				);
				const data = response.data;

				setExpenses(data.expenses);
				if (data.error) return toast.error(data.error);
				return toast.success(data.message);
			} catch (error) {
				toast.error(error.message);
			}
		};
		fetchExpenses();

		const fetchAllExpenses = async () => {
			try {
				const response = await axios.get(
					`${baseUrl}/api/expense/getAllExpenses`,
				);
				const data = response.data;
				const sortedExpenses = data.sort((a, b) => b.amount - a.amount);
				setAllExpenses(sortedExpenses);
			} catch (error) {
				console.error("Error fetching expenses:", error);
			}
		};
		fetchAllExpenses();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const categoryValue =
				category === "Other" ? otherCategory : category;

			const response = await axios.post(
				`${baseUrl}/api/expense/createExpense`,
				{
					amount,
					description,
					category: categoryValue,
					userId,
				},
			);
			const data = response.data;

			setAmount("");
			setDescription("");
			setCategory("");
			setOtherCategory("");
			setExpenses([...expenses, data.expense]);
			const sortedExpenses = data.expenses.sort(
				(a, b) => b.amount - a.amount,
			);
			setAllExpenses(sortedExpenses);
			if (data.error) return toast.error(data.error);
			return toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(
				`${baseUrl}/api/expense/deleteExpenses/${id}/${userId}`,
			);
			const data = response.data;
			setExpenses(expenses.filter((expense) => expense.id !== id));
			setAllExpenses(allExpenses.filter((expense) => expense.id !== id));
			if (data.error) return toast.error(data.error);
			return toast.success(data.message);
		} catch (error) {
			toast.error("Failed to delete expense");
		}
	};

	// for premium users only
	const handlePayment = async () => {
		try {
			// get request for getting the razorpay secrect key
			const {
				data: { key },
			} = await axios.get(`${baseUrl}/api/payment/key`);

			// post request for creating a payment order
			const orderResponse = await axios.post(
				`${baseUrl}/api/payment/order`,
				{ userId },
			);

			const { orderId, amount } = orderResponse.data;
			if (orderResponse.data.error)
				return toast.error(orderResponse.data.error);
			toast.success(orderResponse.data.message);

			const options = {
				key,
				amount,
				currency: "INR",
				name: "Mystic Coder",
				description: "Test Transaction",
				image: "https://example.com/your_logo",
				order_id: orderId,

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
					name: userName,
					email: userEmail,
					contact: "9000090000",
				},
				notes: {
					address: "Razorpay Corporate Office",
				},
				theme: {
					color: "#B53471",
				},
			};
			const razor = new window.Razorpay(options);
			razor.on("payment.failed", async (response) => {
				const { data } = await axios.post(
					`${baseUrl}/api/payment/paymentFailed`,
					{
						userId,
						orderId: response.error.metadata.order_id,
						paymentId: response.error.metadata.payment_id,
					},
				);
				if (data.error) {
					navigate("/paymentFailed");
					toast.error(data.error);
				}
			});
			razor.open();
		} catch (error) {
			return toast.error(error.message);
		}
	};

	return (
		<>
			<Navbar />
			<div className="p-4">
				<h2 className="mb-4 text-2xl font-bold">
					Daily Expense Tracker
				</h2>

				{/* TODO: expense form */}
				<form onSubmit={handleSubmit} className="mb-4">
					<div className="mb-4">
						<label htmlFor="amount" className="block mb-1">
							Amount:
						</label>
						<input
							type="number"
							id="amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="w-full px-3 py-2 border-gray-300 rounded-md"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="description" className="block mb-1">
							Description:
						</label>
						<input
							type="text"
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full px-3 py-2 border-gray-300 rounded-md"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="category" className="block mb-1">
							Category:
						</label>
						<select
							id="category"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="w-full px-3 py-2 border-gray-300 rounded-md"
							required
						>
							<option value="">Select Category</option>
							<option value="Food">Food</option>
							<option value="Transportation">
								Transportation
							</option>
							<option value="Shopping">Shopping</option>
							<option value="Bills">Bills</option>
							<option value="Other">Other</option>
						</select>
					</div>
					{category === "Other" && (
						<div className="mb-4">
							<label
								htmlFor="otherCategory"
								className="block mb-1"
							>
								Other Category:
							</label>
							<input
								type="text"
								id="otherCategory"
								value={otherCategory}
								onChange={(e) =>
									setOtherCategory(e.target.value)
								}
								className="w-full px-3 py-2 border-gray-300 rounded-md"
								required
							/>
						</div>
					)}
					<button
						type="submit"
						className={`px-4 py-2 text-white transition-colors duration-300 bg-blue-500 rounded-md hover:bg-blue-600`}
					>
						Add Expense
					</button>

					<button
						onClick={handlePayment}
						className={`p-2 ml-4 border-2 border-black rounded-md ${
							user?.status === "completed" && "hidden"
						}  `}
					>
						Pay Now
					</button>

					<span
						className={`ml-4 bg-green-400 p-2 rounded-md hover:bg-green-600 font-semibold ${
							user?.status !== "completed" && "hidden"
						}`}
					>
						You are a premium user now
					</span>
				</form>

				<h3 className="mb-2 text-lg font-bold">Expense Table</h3>

				{/* TODO: expense table */}
				<table className="w-full mb-4 ">
					<thead>
						<tr>
							<th className="px-4 py-2 border-b-2 border-gray-300">
								Amount
							</th>
							<th className="px-4 py-2 border-b-2 border-gray-300">
								Description
							</th>
							<th className="px-4 py-2 border-b-2 border-gray-300">
								Category
							</th>
							<th className="px-4 py-2 border-b-2 border-gray-300">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{expenses.map((expense) => (
							<tr key={expense.id}>
								<td className="px-4 py-2 border-b border-gray-300">
									{expense.amount}
								</td>
								<td className="px-4 py-2 border-b border-gray-300">
									{expense.description}
								</td>
								<td className="px-4 py-2 border-b border-gray-300">
									{expense.category}
								</td>
								<td className="px-4 py-2 border-b border-gray-300">
									<button
										onClick={() => handleDelete(expense.id)}
										className="text-red-500 transition-colors duration-300 hover:text-red-600"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{user?.status === "completed" && (
					<div className=" mt-5">
						<h1 className="text-2xl font-bold mb-4">
							Expense Leaderboard
						</h1>
						<table className="min-w-full bg-white border border-gray-300">
							<thead>
								<tr>
									<th className="py-2 px-4 border-b">
										Amount
									</th>
									<th className="py-2 px-4 border-b">
										Description
									</th>
									<th className="py-2 px-4 border-b">
										Category
									</th>
									<th className="py-2 px-4 border-b">
										Created By
									</th>
								</tr>
							</thead>
							<tbody>
								{allExpenses.map((expense) => (
									<tr key={expense.id}>
										<td className="py-2 px-4 border-b">
											{expense.amount}
										</td>
										<td className="py-2 px-4 border-b">
											{expense.description}
										</td>
										<td className="py-2 px-4 border-b">
											{expense.category}
										</td>
										<td className="py-2 px-4 border-b">
											{expense?.User?.name}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
};

export default DailyExpense;
