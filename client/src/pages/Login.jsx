/** @format */

import Navbar from "../components/Navbar";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const baseUrl = "http://localhost:8080";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setEmail("");
		setPassword("");
		try {
			const response = await axios.post(`${baseUrl}/api/users/login`, {
				email,
				password,
			});
			const data = response.data;
			console.log(data);
			// Display success message
			if (data) toast.success(data.meassage);
			// Handle the response from the backend API
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
			</div>
		</>
	);
};

export default Login;
