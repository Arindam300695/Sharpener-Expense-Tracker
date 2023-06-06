/** @format */

const Leaderboard = ({ allExpenses }) => {
	return (
		<div className=" mt-5">
			<h1 className="text-2xl font-bold mb-4">Expense Leaderboard</h1>
			<table className="min-w-full bg-white border border-gray-300">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">Amount</th>
						<th className="py-2 px-4 border-b">Description</th>
						<th className="py-2 px-4 border-b">Category</th>
						<th className="py-2 px-4 border-b">Created By</th>
					</tr>
				</thead>
				<tbody>
					{allExpenses.map((expense) => (
						<tr key={expense.id}>
							<td className="py-2 px-4 border-b">
								{expense.amount}
							</td>
							<td className="py-2 px-4 border-b">
								{expense.description}
							</td>
							<td className="py-2 px-4 border-b">
								{expense.category}
							</td>
							<td className="py-2 px-4 border-b">
								{expense.User.name}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Leaderboard;
