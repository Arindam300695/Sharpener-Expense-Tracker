/** @format */

import { motion } from "framer-motion";
import { RiThumbUpFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<motion.div
				initial={{ scale: [0, 1.5, 0.5] }}
				animate={{ scale: [3, 1, 1.5] }}
				transition={{ duration: 1.25 }}
				className="flex items-center justify-center p-8 bg-white rounded-full shadow-lg"
			>
				<RiThumbUpFill className="text-6xl text-green-500" />
			</motion.div>
			<motion.h1
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className="text-4xl font-semibold text-gray-800 mt-14"
			>
				Thank You!
			</motion.h1>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.5 }}
				className="mt-4 text-lg text-gray-600"
			>
				We appreciate your support.
			</motion.p>
			<Link to="/" className="m-10">
				<motion.a
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5, duration: 0.5 }}
					className="px-6 py-3 mt-8 text-white transition-colors duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
				>
					Back to Home
				</motion.a>
			</Link>
		</div>
	);
};

export default ThankYouPage;
