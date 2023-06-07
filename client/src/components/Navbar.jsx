/** @format */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.gif";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState(null);
	console.log(user);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const localStorageUser = JSON.parse(localStorage.getItem("user"));
		if (localStorageUser !== null) setUser(localStorageUser);
		return () => {};
	}, []);

	const logoutHandler = () => {
		localStorage.removeItem("user");
		navigate("/");
	};

	return (
		<nav className="bg-[#13131b]">
			<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-24">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<img
								className="w-40 h-16 bg-inherit"
								src={logo}
								alt="Logo"
							/>
						</div>
						<div className="hidden md:block">
							<div className="flex items-baseline ml-10 space-x-4">
								<Link
									to="/"
									className="px-3 py-2 text-sm font-medium text-white rounded-md"
								>
									Home
								</Link>

								{!user ? (
									<div>
										<Link
											to="/signup"
											className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
										>
											Signup
										</Link>
										<Link
											to="/login"
											className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
										>
											Login
										</Link>
									</div>
								) : (
									<div>
										<Link
											to="/dailyExpense"
											className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
										>
											Daily Expense
										</Link>
										<Link
											to="/thankyou"
											className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
											onClick={logoutHandler}
										>
											Log out
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="flex -mr-2 md:hidden">
						<button
							onClick={toggleMenu}
							type="button"
							className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							<motion.span
								className={`${isOpen ? "hidden" : "block"}`}
								initial={{ opacity: 0, rotate: 0 }}
								animate={{ opacity: 1, rotate: 0 }}
								transition={{ duration: 0.5 }}
							>
								<FiMenu className="w-6 h-6" />
							</motion.span>
							<motion.span
								className={`${isOpen ? "block" : "hidden"}`}
								initial={{ opacity: 0, rotate: 0 }}
								animate={{ opacity: 1, rotate: 0 }}
								transition={{ duration: 0.5 }}
							>
								<FiX className="w-6 h-6" />
							</motion.span>
						</button>
					</div>
				</div>
			</div>
			<div
				className={`${isOpen ? "block" : "hidden"} md:hidden`}
				id="mobile-menu"
			>
				<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
					<Link
						to="/"
						className="block px-3 py-2 text-base font-medium text-white rounded-md"
					>
						Home
					</Link>
					{!user ? (
						<div>
							<Link
								to="/signup"
								className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
							>
								Signup
							</Link>
							<Link
								to="/login"
								className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
							>
								Login
							</Link>
						</div>
					) : (
						<div>
							<Link
								to="/dailyExpense"
								className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
							>
								Daily Expense
							</Link>
							<Link
								to="/"
								className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
								onClick={logoutHandler}
							>
								Log Out
							</Link>
						</div>
					)}
				</div>
			</div>
			<ToastContainer />
		</nav>
	);
};

export default Navbar;
