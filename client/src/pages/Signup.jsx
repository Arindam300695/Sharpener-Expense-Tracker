/** @format */

import Navbar from "../components/Navbar";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setPasswordVisible] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name && email && password) {
			console.log(name, email, password);
			setName("");
			setEmail("");
			setPassword("");
			// Perform signup logic here
			toast.success("Signup successful!");
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
				</form>
			</div>
		</>
	);
};

export default Signup;
