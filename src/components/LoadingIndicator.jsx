import { Box, CircularProgress } from "@mui/material";

const LoadingIndicator = () => {
	return (
		<Box
			display="flex"
			position="absolute"
			left="0"
			top="0"
			width="100vw"
			height="100vh"
			zIndex={Number.MAX_SAFE_INTEGER}
		>
			<CircularProgress
				color="success"
				sx={{
					margin: "auto !important",
					width: "175px !important",
					height: "175px !important",
				}}
			/>
		</Box>
	);
};

export default LoadingIndicator;
