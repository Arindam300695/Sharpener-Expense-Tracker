/** @format */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import moment from "moment";

const baseUrl = "https://expense-tracker-ri7u.onrender.com";

const PreviousDowloadedReportList = () => {
	const [downLoadedReportList, setDonwloadedReportList] = useState([]);

	useEffect(() => {
		const fetchPreviousDowloadedReport = async () => {
			const { data } = await axios.get(`${baseUrl}/api/previousReports`);
			setDonwloadedReportList(data.allReportsData);
		};
		fetchPreviousDowloadedReport();

		return () => {};
	}, []);

	// time formatting function
	const formatDate = (createdDate) => {
		const formattedDate = moment(createdDate).format("DD MMM YYYY"); // Example format: 09 Jun 2023
		return formattedDate;
	};

	const downloadHandler = (linktobedownloaded) => {
		const link = document.createElement("a");
		link.href = linktobedownloaded;
		link.setAttribute("download", "file.txt");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div>
			<Navbar />
			{downLoadedReportList.length === 0 ? (
				<div>You have no downloaded list as of now</div>
			) : (
				<div>
					{downLoadedReportList.map((list) => (
						<div
							key={list.id}
							className="flex justify-between p-4 gap-7"
						>
							<div
								onClick={() => {
									downloadHandler(list.url);
								}}
								className="text-xl font-semibold cursor-pointer"
							>
								{list.url}
							</div>
							<h1 className="font-bold">
								{formatDate(list.createdAt)}
							</h1>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PreviousDowloadedReportList;
