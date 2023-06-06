/** @format */

import { Link } from "react-router-dom";

const PaymentSuccess = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
			<div className="max-w-md p-8 mx-auto text-center rounded-lg shadow-lg bg-slate-950">
				<div className="flex items-center justify-center w-16 h-16 mx-auto border-4 border-green-500 rounded-full animate-spin-slow">
					<svg
						className="w-6 h-6 text-green-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h2 className="mb-2 text-2xl font-semibold text-white">
					Payment Successful!
				</h2>
				<h2 className="mb-2 text-2xl font-semibold text-white">
					Thank you for your payment
				</h2>
				<Link to="/">
					<button className="px-4 py-2 mt-6 text-xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
						Go back to Home
					</button>
				</Link>
			</div>
		</div>
	);
};

export default PaymentSuccess;
