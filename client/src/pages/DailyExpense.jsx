/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const baseUrl = "http://localhost:8080";

const DailyExpense = () => {
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [otherCategory, setOtherCategory] = useState("");
	const [expenses, setExpenses] = useState([]);

	useEffect(() => {
		fetchExpenses();
	}, []);

	const fetchExpenses = async () => {
		try {
			const response = await axios.get(
				`${baseUrl}/api/expense/getExpenses`,
			);
			const data = response.data;
			setExpenses(data.expenses);
			if (data.error) return toast.error(data.error);
			return toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

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
				},
			);
			const data = response.data;
			console.log(data);
			setAmount("");
			setDescription("");
			setCategory("");
			setOtherCategory("");
			setExpenses([...expenses, data.expense]);
			if (data.error) return toast.error(data.error);
			return toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(
				`${baseUrl}/api/expense/deleteExpenses/${id}`,
			);
			const data = response.data;
			setExpenses(expenses.filter((expense) => expense.id !== id));
			if (data.error) return toast.error(data.error);
			return toast.success(data.message);
		} catch (error) {
			console.error("Error deleting expense:", error);
			toast.error("Failed to delete expense");
		}
	};

	return (
		<>
			<Navbar />
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-4">
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
							className="w-full border-gray-300 rounded-md py-2 px-3"
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
							className="w-full border-gray-300 rounded-md py-2 px-3"
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
							className="w-full border-gray-300 rounded-md py-2 px-3"
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
								className="w-full border-gray-300 rounded-md py-2 px-3"
								required
							/>
						</div>
					)}
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
					>
						Add Expense
					</button>
				</form>

				<h3 className="text-lg font-bold mb-2">Expense Table</h3>

				{/* TODO: expense table */}
				<table className="w-full border-collapse mb-4">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b-2 border-gray-300">
								Amount
							</th>
							<th className="py-2 px-4 border-b-2 border-gray-300">
								Description
							</th>
							<th className="py-2 px-4 border-b-2 border-gray-300">
								Category
							</th>
							<th className="py-2 px-4 border-b-2 border-gray-300">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{expenses.map((expense) => (
							<tr key={expense.id}>
								<td className="py-2 px-4 border-b border-gray-300">
									{expense.amount}
								</td>
								<td className="py-2 px-4 border-b border-gray-300">
									{expense.description}
								</td>
								<td className="py-2 px-4 border-b border-gray-300">
									{expense.category}
								</td>
								<td className="py-2 px-4 border-b border-gray-300">
									<button
										onClick={() => handleDelete(expense.id)}
										className="text-red-500 hover:text-red-600 transition-colors duration-300"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default DailyExpense;
