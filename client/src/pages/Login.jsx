/** @format */

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:8080";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [remainingTime, setRemainingTime] = useState(10);

	useEffect(() => {
		if (isModalOpen) {
			const timer = setTimeout(() => {
				setModalOpen(false);
			}, 10000);

			const interval = setInterval(() => {
				setRemainingTime((prev) => prev - 1);
			}, 1000);

			return () => {
				clearTimeout(timer);
				clearInterval(interval);
			};
		}
	}, [isModalOpen]);

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setRemainingTime(10);

		setEmail("");
		setPassword("");
		try {
			const response = await axios.post(`${baseUrl}/api/users/login`, {
				email,
				password,
			});
			const data = response.data;
			// Display success message
			if (data.message) {
				toast.success(data.message);
				handleOpenModal();
				setTimeout(() => {
					navigate("/dailyExpense");
				}, 10000);
			}
			// Handle the error from the backend API
			if (data.error) return toast.error(data.error);
		} catch (error) {
			toast.error(error.meassage); // Display error message
			// Handle error
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<>
			<Navbar />
			<div className="flex items-center justify-center h-screen">
				<form
					onSubmit={handleSubmit}
					className="w-1/3 p-8 bg-white rounded-md shadow-md"
				>
					<h2 className="mb-4 text-2xl font-bold">Login</h2>
					<div className="mb-4">
						<label htmlFor="email" className="block mb-1">
							Email:
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							required
						/>
					</div>
					<div className="relative mb-6">
						<label htmlFor="password" className="block mb-1">
							Password:
						</label>
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
							required
						/>
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="absolute transform -translate-y-1/2 right-2 top-2"
						>
							{showPassword ? (
								<FaEyeSlash className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
							) : (
								<FaEye className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
							)}
						</button>
					</div>
					<button
						type="submit"
						className="px-4 py-2 text-white bg-blue-500 rounded-md"
					>
						Login
					</button>
					<p className="mt-4 text-sm">
						Dont have an account?{" "}
						<Link to="/signup" className="font-semibold">
							Sign up
						</Link>
					</p>
				</form>

				{isModalOpen && (
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div className="fixed inset-0 bg-black opacity-50"></div>
						<div className="bg-white rounded-lg p-6 z-10">
							<div className="mt-4">
								<h2 className="text-xl font-bold mb-2">
									Redirecting you to the Daily Expenses page
								</h2>
								<p className="text-gray-700">
									{formatTime(remainingTime)}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Login;
