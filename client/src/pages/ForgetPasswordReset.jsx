/** @format */

import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:8080";

const ForgetPasswordReset = () => {
	const navigate = useNavigate();
	const { requestId } = useParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isUserAbleToChangePassword, setIsUserAbleToChangePassword] =
		useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Perform password reset logic here
		try {
			if (password !== confirmPassword)
				return toast.error(
					"password and confirm password do not match",
				);
			const { data } = await axios.post(
				`${baseUrl}/api/passwordReset/confirmResetPassword`,
				{ email, requestId, password },
			);
			if (data.error) return toast.error(data.error);
			else {
				setTimeout(() => {
					navigate("/");
				}, 1500);
				toast.success(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		const resetPassword = async () => {
			try {
				const { data } = await axios.post(
					`${baseUrl}/api/passwordReset/reset-password`,
					{
						requestId,
					},
				);
				if (data.isAbleToResetPassword) {
					setIsUserAbleToChangePassword(true);
				} else {
					setIsUserAbleToChangePassword(false);
				}
				// Handle any success actions or UI updates
			} catch (error) {
				toast.error(error);
				// Handle any error actions or UI updates
			}
		};

		resetPassword();
	}, [requestId]);

	return (
		<div>
			<Navbar />
			ForgetPasswordReset from : {requestId}
			{/* password reset form */}
			{isUserAbleToChangePassword ? (
				<div className="flex items-center justify-center h-screen">
					<motion.form
						className="p-6 bg-white rounded shadow-md"
						onSubmit={handleSubmit}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="mb-4 text-2xl font-bold">
							Reset Password
						</h1>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block mb-2 font-medium"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="password"
								className="block mb-2 font-medium"
							>
								New Password
							</label>
							<input
								type="password"
								id="password"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
								placeholder="Enter your new password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="confirmPassword"
								className="block mb-2 font-medium"
							>
								Confirm Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
								placeholder="Confirm your new password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 text-white transition-colors duration-300 bg-blue-500 rounded hover:bg-blue-600"
						>
							Reset Password
						</button>
					</motion.form>
				</div>
			) : (
				<div>Oops the link is invalid</div>
			)}
		</div>
	);
};

export default ForgetPasswordReset;
