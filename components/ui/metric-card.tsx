interface MetricCardProps {
	title: string;
	value: number;
	color: string;
}

export function MetricCard({ title, value, color }: MetricCardProps) {
	return (
		<div className="p-6 bg-white rounded-lg border border-gray-100">
			<div className="flex items-center gap-4">
				<div
					className={`w-12 h-12 rounded-full flex items-center justify-center`}
					style={{ backgroundColor: color }}
				/>
				<div>
					<p className="text-gray-600 text-sm">{title}</p>
					<p className="text-2xl font-semibold">{value}</p>
				</div>
			</div>
		</div>
	);
}
