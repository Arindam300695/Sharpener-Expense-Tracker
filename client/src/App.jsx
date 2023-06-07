/** @format */

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DailyExpense from "./pages/DailyExpense";
import PaymentSuccess from "./pages/PaymentSuccss";
import PaymentFailedPage from "./pages/PaymentFailed";
import Error404Page from "./pages/Error404Page";
import ThankYouPage from "./pages/ThankYouPage";

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
				<Route path="/thankyou" element={<ThankYouPage />} />
				<Route path="*" element={<Error404Page />} />
			</Routes>
		</>
	);
}

export default App;
