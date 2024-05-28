import { Box, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "../theme";

export default function ProgressCircle({ progress = 0 }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const value = progress * 100;

	return (
		<Box sx={{ position: "relative", display: "inline-flex" }}>
			<CircularProgress
				variant="determinate"
				size={45}
				thickness={5}
				value={100}
				sx={{ color: colors.blueAccent[500] }}
			/>

			<CircularProgress
				variant="determinate"
				size={45}
				thickness={5}
				value={value}
				sx={{
					color: colors.greenAccent[500],
					position: "absolute",
					left: 0,
				}}
			/>
		</Box>
	);
}
