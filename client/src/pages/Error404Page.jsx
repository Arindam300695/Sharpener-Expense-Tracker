/** @format */

import { Link } from "react-router-dom";
import { RiArrowGoBackLine } from "react-icons/ri";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Error404Page = () => {
	return (
		<>
			<Navbar />
			<div className="flex flex-col items-center justify-center h-screen">
				<motion.h1
					className="mb-4 text-6xl font-bold text-red-500"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					404
				</motion.h1>
				<motion.p
					className="mb-8 text-xl text-gray-700"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Oops! Page not found.
				</motion.p>
				<motion.div
					className="flex items-center space-x-2"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<RiArrowGoBackLine className="text-xl text-gray-600" />
					<Link
						to="/"
						className="font-medium text-gray-600 hover:text-gray-900"
					>
						Go back to home
					</Link>
				</motion.div>
			</div>
		</>
	);
};

export default Error404Page;
