/** @format */

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DailyExpense from "./pages/DailyExpense";
import PaymentSuccess from "./pages/PaymentSuccss";
import PaymentFailedPage from "./pages/PaymentFailed";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dailyExpense" element={<DailyExpense />} />
				<Route path="/paymentSuccess" element={<PaymentSuccess />} />
				<Route path="/paymentFailed" element={<PaymentFailedPage />} />
			</Routes>
		</>
	);
}

export default App;
