import { Box, Link, Typography } from "@mui/material";

export default function NotFound() {
	return (
		<Box
			width="100vw"
			height="100vh"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			sx={{
				backgroundColor: "#FAD961",
				backgroundImage:
					"linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)",
			}}
		>
			<Typography variant="h1" fontWeight="bold">
				NOT FOUND PAGE
			</Typography>
			<Link
				href="/login"
				underline="none"
				fontWeight="bold"
				sx={{ marginTop: "25px", fontSize: "large" }}
			>
				BACK TO LOGIN
			</Link>
		</Box>
	);
}
