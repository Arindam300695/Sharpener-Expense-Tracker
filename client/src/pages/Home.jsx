/** @format */
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { RiFile2Line } from "react-icons/ri";
import resume from "../assets/Arindam Chattopadhyay.pdf";
import Navbar from "../components/Navbar";

const Home = () => {
	return (
		<>
			<Navbar />
			<div className="flex flex-col items-center justify-center h-screen bg-blue-500">
				<motion.h1
					className="text-4xl font-bold text-white"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					Welcome to my Awesome Home Page
				</motion.h1>
				<div className="flex gap-10 mt-4 space-x-4">
					<a
						title="check out my github profile"
						href="https://github.com/Arindam300695/Arindam300695"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaGithub className="text-5xl text-white transition-colors duration-300 hover:text-gray-400" />
					</a>
					<a
						title="download my resume"
						href={resume}
						target="_blank"
						rel="noopener noreferrer"
					>
						<RiFile2Line className="text-5xl text-white transition-colors duration-300 hover:text-blue-200" />
					</a>
				</div>
			</div>
		</>
	);
};

export default Home;
