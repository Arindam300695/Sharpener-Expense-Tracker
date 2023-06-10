/** @format */

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "https://expense-tracker-1o1h.onrender.com";

const Signup = () => {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setPasswordVisible] = useState(false);
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

		if (name && email && password) {
			setName("");
			setEmail("");
			setPassword("");
			// Perform signup logic here
			try {
				const response = await axios.post(
					`${baseUrl}/api/users/signup`,
					{ name, email, password },
				);
				const data = response.data;
				console.log(data);
				// Display success message
				if (data.message) {
					toast.success(data.message);
					handleOpenModal();
					setTimeout(() => {
						navigate("/login");
					}, 10000);
				}
				// Handle the error from the backend API
				if (data.error) return toast.error(data.error);
			} catch (error) {
				toast.error(error); // Display error message
				// Handle error
			}
		} else {
			toast.error("Please fill in all fields.");
		}
	};

	const togglePasswordVisibility = () => {
		setPasswordVisible(!isPasswordVisible);
	};

	return (
		<>
			<Navbar />
			<div className="max-w-md p-6 mx-auto my-10 bg-white rounded-lg shadow-md">
				{/* modal */}
				<h2 className="mb-6 text-2xl font-semibold">Signup</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="name"
							className="block mb-2 font-medium text-gray-700"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block mb-2 font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="relative mb-4">
						<label
							htmlFor="password"
							className="block mb-2 font-medium text-gray-700"
						>
							Password
						</label>
						<input
							type={isPasswordVisible ? "text" : "password"}
							id="password"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className="absolute top-2 right-2">
							{isPasswordVisible ? (
								<FaEyeSlash
									className="text-gray-500 cursor-pointer"
									onClick={togglePasswordVisibility}
								/>
							) : (
								<FaEye
									className="text-gray-500 cursor-pointer"
									onClick={togglePasswordVisibility}
								/>
							)}
						</div>
					</div>
					<button
						type="submit"
						className="px-4 py-2 font-medium text-white transition-colors duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
					>
						Sign Up
					</button>
					<p className="mt-4 text-sm">
						Already have an account?{" "}
						<Link to="/login" className="font-semibold">
							Login
						</Link>
					</p>
				</form>

				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="fixed inset-0 bg-black opacity-50"></div>
						<div className="z-10 p-6 bg-white rounded-lg">
							<div className="mt-4">
								<h2 className="mb-2 text-xl font-bold">
									Redirecting you to the Login page
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

export default Signup;
