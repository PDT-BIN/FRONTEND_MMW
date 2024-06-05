import { useTheme } from "@emotion/react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { Box, Typography } from "@mui/material";
import { pieChartData } from "../data/mockChartData";

const CustomTooltip = ({ datum }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			padding="10px"
			borderRadius="3px"
			bgcolor={colors.grey[600]}
			boxShadow="0 3px 6px rgba(0, 0, 0, 0.1)"
		>
			<Typography variant="h5" fontWeight="bold" color={datum.color}>
				{datum.label}
			</Typography>
			<Typography variant="h6" fontStyle="italic" mt="3px">
				Quantity: {datum.data.quantity}
			</Typography>
			<Typography variant="h6" fontStyle="italic" mt="3px">
				Total: {datum.value}
			</Typography>
		</Box>
	);
};

export default function MyResponsivePie() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const data = pieChartData;

	return (
		<ResponsivePie
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
						},
					},
				},
				legends: {
					text: {
						fill: colors.grey[100],
					},
				},
				labels: {
					text: {
						fontStyle: "italic",
					},
				},
			}}
			tooltip={CustomTooltip}
			margin={{ top: 40, right: 120, bottom: 40, left: 0 }}
			innerRadius={0.5}
			padAngle={0.7}
			cornerRadius={3}
			activeOuterRadiusOffset={8}
			borderWidth={1}
			borderColor={{
				from: "color",
				modifiers: [["darker", 0.2]],
			}}
			enableArcLinkLabels={true}
			arcLinkLabel={(datum) => datum.label}
			arcLinkLabelsSkipAngle={10}
			arcLinkLabelsTextColor={colors.grey[100]}
			arcLinkLabelsThickness={2}
			arcLinkLabelsColor={{ from: "color" }}
			enableArcLabels={false}
			arcLabelsSkipAngle={10}
			arcLabelsTextColor={{
				from: "color",
				modifiers: [["darker", 2]],
			}}
		/>
	);
}
