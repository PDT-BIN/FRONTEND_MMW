import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

export default function StatBox({
	title,
	subtitle,
	icon,
	progress,
	increase,
	onlyTotal,
}) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box width="100%" m="0 25px">
			<Box display="flex" justifyContent="space-between">
				<Box display="flex" flexDirection="column" gap="5px">
					{icon}
					<Typography
						variant="h4"
						fontFamily="monospace"
						sx={{ color: colors.grey[100] }}
					>
						{title}
					</Typography>
					<Typography
						variant="h5"
						sx={{ color: colors.greenAccent[500] }}
					>
						{subtitle}
					</Typography>
				</Box>
				{!onlyTotal && (
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
						gap="10px"
					>
						<ProgressCircle progress={progress} />
						<Typography
							variant="h5"
							fontFamily="monospace"
							sx={{ color: colors.greenAccent[600] }}
						>
							{increase}
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}
