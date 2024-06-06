import { useTheme } from "@emotion/react";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { Box, Typography } from "@mui/material";
import { NUM_TO_MON } from "../scenes/constants";

const CustomTooltip = ({ id, value, color, indexValue }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			padding="10px"
			borderRadius="3px"
			bgcolor={colors.grey[600]}
			boxShadow="0 3px 6px rgba(0, 0, 0, 0.1)"
		>
			<Typography variant="h5" fontWeight="bold" color={color}>
				{id.toUpperCase()} - {NUM_TO_MON[indexValue]}
			</Typography>
			<Typography variant="h6" fontStyle="italic" mt="3px">
				Total: {value}
			</Typography>
		</Box>
	);
};

export default function BarChart({ data }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<ResponsiveBar
			data={data}
			theme={{
				axis: {
					domain: {
						line: {
							stroke: colors.grey[100],
						},
					},
					legend: {
						text: {
							fill: colors.grey[100],
						},
					},
					ticks: {
						line: {
							stroke: colors.grey[100],
							strokeWidth: 1,
						},
						text: {
							fill: colors.grey[100],
							fontWeight: "bold",
						},
					},
				},
				legends: {
					text: {
						fill: colors.grey[100],
					},
				},
			}}
			tooltip={CustomTooltip}
			keys={["total_import", "total_export"]}
			indexBy="month"
			margin={{ top: 20, right: 0, bottom: 40, left: 0 }}
			padding={0.3}
			groupMode="grouped"
			valueScale={{ type: "linear" }}
			indexScale={{ type: "band", round: true }}
			colors={{ scheme: "nivo" }}
			borderColor={{
				from: "color",
				modifiers: [["darker", 1.6]],
			}}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: "",
				legendPosition: "middle",
				legendOffset: 32,
				truncateTickAt: 0,
			}}
			axisLeft={null}
			enableGridY={false}
			enableLabel={false}
			labelSkipWidth={12}
			labelSkipHeight={12}
			labelTextColor={{
				from: "color",
				modifiers: [["darker", 1.6]],
			}}
			role="application"
			ariaLabel="Nivo bar chart demo"
		/>
	);
}
