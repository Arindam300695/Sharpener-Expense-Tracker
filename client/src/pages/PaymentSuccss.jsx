/** @format */

import { motion } from "framer-motion";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<motion.div
				initial={{ translate: "-200px" }}
				animate={{ translate: 0 }}
				transition={{ duration: 1.25 }}
				className="flex items-center justify-center p-8 bg-white rounded-full shadow-lg"
			>
				<RiCheckboxCircleFill className="text-6xl text-green-500" />
			</motion.div>
			<motion.h1
				initial={{ translate: "200px" }}
				animate={{ translate: 0 }}
				transition={{ delay: 0.1, duration: 1.25 }}
				className="mt-8 text-4xl font-semibold text-gray-800"
			>
				Payment Successful!
			</motion.h1>
			<motion.div
				initial={{ x: -300 }}
				animate={{ x: 100 }}
				transition={{ type: "spring", stiffness: 200, duration: 5000 }}
				className="mt-4 text-lg text-gray-600"
			>
				you can now enjoy your premium facilities
			</motion.div>
			<Link to="/dailyExpense" className="m-10">
				<motion.div
					initial={{ y: 400 }}
					animate={{ y: 0 }}
					transition={{ type: "spring", stiffness: 150, duration: 1 }}
					className="px-6 py-3 mt-8 text-white transition-colors duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
				>
					Back to Daily Expense
				</motion.div>
			</Link>
		</div>
	);
};

export default PaymentSuccess;
