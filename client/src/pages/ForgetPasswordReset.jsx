/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

const baseUrl = "http://localhost:8080";

const ForgetPasswordReset = () => {
	const navigate = useNavigate();

	const [isAbleToResetPassword, setIsAbleToResetPassword] = useState(false);
	const [otp, setOtp] = useState("");
	const [message, setMessage] = useState("");
	const [verifiedOtp, setVerifiedOtp] = useState("");
	const [requestId, setRequestId] = useState("");
	const [passwordResetForm, setPasswordResetForm] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	console.log(isAbleToResetPassword);
	console.log("passwordResetForm: ", passwordResetForm);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		const forgetPasswordRequest = JSON.parse(
			localStorage.getItem("forgetPasswords"),
		);
		if (forgetPasswordRequest !== null) {
			setVerifiedOtp(forgetPasswordRequest.otp);
			setRequestId(forgetPasswordRequest.id);
		}

		if (user === null && forgetPasswordRequest === null) navigate("/");

		console.log(user, forgetPasswordRequest);

		const verifyingPasswordResetAbility = async () => {
			const { data } = await axios.get(
				`${baseUrl}/api/passwordReset/reset-password/${forgetPasswordRequest.id}`,
			);
			// localStorage.setItem("forgetPasswords", {...JSON.parse(localStorage.getItem("forgetPasswords"))});
			setIsAbleToResetPassword(data.isAbleToResetPassword);
		};
		verifyingPasswordResetAbility();

		return () => {};
	}, [navigate]);

	const handleOtpChange = (e) => {
		setOtp(e.target.value);
	};

	// function for handling otp submitting logic
	const handleSubmit = (e) => {
		e.preventDefault();

		// Here, you can perform the necessary validation and API calls to verify the OTP

		if (Number(otp) === verifiedOtp) {
			setMessage("OTP is valid!🎉");
			setPasswordResetForm(true);
		} else {
			setMessage("Invalid OTP. Please try again.😖");
		}
	};

	const handleNewPasswordChange = (e) => {
		setNewPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
	};

	// function for handling password change logic
	const handleConfirmPasswordSubmit = async (e) => {
		e.preventDefault();

		// Here, you can perform the necessary validation and API calls to update the password

		if (newPassword === confirmPassword) {
			const { data } = await axios.post(
				`${baseUrl}/api/passwordReset/confirmResetPassword`,
				{
					requestId,
					password: newPassword,
				},
			);

			// Passwords match, update the password
			if (data.error) return toast.error(data.error);
			else {
				localStorage.setItem(
					"forgetPasswords",
					JSON.stringify({
						...JSON.parse(localStorage.getItem("forgetPasswords")),
						isActive: false,
					}),
				);
				toast.success(data.message);
				setTimeout(() => {
					navigate("/");
				}, 1500);
			}
		} else {
			// Passwords do not match
			toast.error("Passwords do not match. Please try again.");
		}
	};

	return (
		<div>
			{/* otp collecting component */}
			{isAbleToResetPassword ? (
				<div className="flex flex-col items-center mt-8">
					<h2 className="mb-4 text-2xl font-bold">Enter OTP</h2>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col items-center"
					>
						<motion.input
							type="text"
							value={otp}
							onChange={handleOtpChange}
							placeholder="Enter OTP"
							className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						/>
						<motion.button
							type="submit"
							className="px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Verify OTP
						</motion.button>
					</form>
					{message && (
						<motion.p
							className={`mt-4 text-2xl ${
								message === "OTP is valid!🎉"
									? "text-green-500"
									: "text-red-500"
							}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							{message}
						</motion.p>
					)}
				</div>
			) : (
				<div>You are not allowed to change your password</div>
			)}
			{isAbleToResetPassword && passwordResetForm && (
				<div className="flex flex-col items-center mt-8">
					<h2 className="mb-4 text-2xl font-bold">
						Set New Password
					</h2>
					<form
						onSubmit={handleConfirmPasswordSubmit}
						className="flex flex-col items-center"
					>
						<motion.input
							type="password"
							value={newPassword}
							onChange={handleNewPasswordChange}
							placeholder="New Password"
							className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						/>
						<motion.input
							type="password"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							placeholder="Confirm Password"
							className="px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						/>
						<motion.button
							type="submit"
							className="px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Update Password
						</motion.button>
					</form>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default ForgetPasswordReset;
