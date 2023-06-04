/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenuLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
	const [isMenuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
	};

	return (
		<nav className="bg-blue-500">
			<div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
				{/* normal navbar */}
				<div className="hidden sm:block">
					<div className="flex items-center">
						<Link
							to="/"
							className="text-white font-semibold text-lg mr-4 transition-colors duration-300 hover:text-blue-200"
						>
							Home
						</Link>
						<Link
							to="/signup"
							className="text-white font-semibold text-lg mr-4 transition-colors duration-300 hover:text-blue-200"
						>
							Signup
						</Link>
						<Link
							to="/login"
							className="text-white font-semibold text-lg transition-colors duration-300 hover:text-blue-200"
						>
							Login
						</Link>
					</div>
				</div>

				<div className="sm:hidden">
					<button
						type="button"
						onClick={toggleMenu}
						className="text-white focus:outline-none"
						aria-label="Toggle menu"
					>
						<RiMenuLine size={24} />
					</button>
				</div>

				{/* Hamburger Menu */}
				{isMenuOpen && (
					<div className="sm:hidden absolute top-0 right-0 bg-blue-500 w-40 py-2 px-4">
						<Link
							to="/"
							className="block text-white font-medium text-lg mb-2 transition-colors duration-300 hover:text-blue-200"
							onClick={toggleMenu}
						>
							Home
						</Link>
						<Link
							to="/signup"
							className="block text-white font-medium text-lg mb-2 transition-colors duration-300 hover:text-blue-200"
							onClick={toggleMenu}
						>
							Signup
						</Link>
						<Link
							to="/login"
							className="block text-white font-medium text-lg transition-colors duration-300 hover:text-blue-200"
							onClick={toggleMenu}
						>
							Login
						</Link>
					</div>
				)}
			</div>
			<ToastContainer />
		</nav>
	);
};

export default Navbar;
