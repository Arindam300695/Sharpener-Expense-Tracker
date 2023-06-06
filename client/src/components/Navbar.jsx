/** @format */

import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenuLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
	const [isMenuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
	};

	return (
		<nav className="w-full bg-blue-500">
			<div className="flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8">
				{/* normal navbar */}
				<div className="hidden sm:block">
					<div className="flex items-center">
						<Link
							to="/"
							className="mr-4 text-lg font-semibold text-white transition-colors duration-300 hover:text-blue-200"
						>
							Home
						</Link>
						<Link
							to="/signup"
							className="mr-4 text-lg font-semibold text-white transition-colors duration-300 hover:text-blue-200"
						>
							Signup
						</Link>
						<Link
							to="/login"
							className="text-lg font-semibold text-white transition-colors duration-300 hover:text-blue-200"
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
					<div className="absolute top-0 right-0 w-40 px-4 py-2 bg-blue-500 sm:hidden">
						<Link
							to="/"
							className="block mb-2 text-lg font-medium text-white transition-colors duration-300 hover:text-blue-200"
							onClick={toggleMenu}
						>
							Home
						</Link>
						<Link
							to="/signup"
							className="block mb-2 text-lg font-medium text-white transition-colors duration-300 hover:text-blue-200"
							onClick={toggleMenu}
						>
							Signup
						</Link>
						<Link
							to="/login"
							className="block text-lg font-medium text-white transition-colors duration-300 hover:text-blue-200"
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
