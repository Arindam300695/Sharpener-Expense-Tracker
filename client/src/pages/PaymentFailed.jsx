/** @format */

import { FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const PaymentFailedPage = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<div className="p-8 text-center bg-white rounded-lg shadow-lg">
				<div className="text-6xl text-red-500 animate-bounce">
					<FaExclamationCircle />
				</div>
				<h1 className="mb-4 text-2xl font-semibold text-gray-800">
					Payment Failed
				</h1>
				<p className="mb-4 text-gray-600">
					Sorry, your payment could not be processed.
				</p>
				<Link
					to="/dailyExpense"
					className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-blue-500 rounded hover:bg-blue-600"
				>
					Go Back to Daily Expense Page
				</Link>
			</div>
		</div>
	);
};

export default PaymentFailedPage;
