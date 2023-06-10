/** @format */

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const baseUrl = "https://expense-tracker-1o1h.onrender.com";

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
				localStorage.setItem("user", JSON.stringify(data.user));
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

	// forget password functionality starts here
	const [showForm, setShowForm] = useState(false);
	const [passwordResetEmail, setPasswordResetEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleButtonClick = () => {
		setShowForm(true);
	};

	const handleEmailChange = (e) => {
		setPasswordResetEmail(e.target.value);
	};

	const handleResetPasswordSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		// Perform necessary actions, such as sending a password reset email
		const { data } = await axios.post(`${baseUrl}/api/passwordReset`, {
			email: passwordResetEmail,
		});

		await new Promise((resolve) => setTimeout(resolve, 2000));
		// Reset form state
		setEmail("");
		setShowForm(false);
		setIsLoading(false);
		if (data.error) return toast.error(data.error);
		toast.success(data.message);
	};
	// forget passwrod fucntionality ends here

	return (
		<>
			<Navbar />
			<div className="flex items-center justify-center h-screen">
				{/* normal login form starts here */}
				<div className="w-1/3 p-8 bg-white rounded-md shadow-md">
					<form onSubmit={handleSubmit}>
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
					{/* normal login form ends here */}

					{/* forget password section */}
					<div className="m-4 text-center">
						{isLoading ? (
							<div className="flex items-center justify-center">
								<div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
							</div>
						) : showForm ? (
							<form
								onSubmit={handleResetPasswordSubmit}
								className="flex flex-col"
							>
								<label
									htmlFor="email"
									className="mb-2 font-medium text-gray-700"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									value={passwordResetEmail}
									onChange={handleEmailChange}
									className="px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
									required
								/>
								<button
									type="submit"
									className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
								>
									Submit
								</button>
							</form>
						) : (
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								whileFocus={{
									boxShadow:
										"0 0 0 3px rgba(66, 153, 225, 0.5)",
								}}
								onClick={handleButtonClick}
								className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
							>
								Forgot Password
							</motion.button>
						)}
					</div>
				</div>

				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="fixed inset-0 bg-black opacity-50"></div>
						<div className="z-10 p-6 bg-white rounded-lg">
							<div className="mt-4">
								<h2 className="mb-2 text-xl font-bold">
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
