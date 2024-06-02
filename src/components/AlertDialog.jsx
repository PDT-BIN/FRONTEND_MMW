import { Alert, AlertTitle, Snackbar } from "@mui/material";

export default function AlertDialog({ onClose, ...props }) {
	return (
		<Snackbar
			open={props.open}
			onClose={onClose}
			autoHideDuration={3000}
			sx={{
				position: "absolute !important",
				left: "auto !important",
				top: "25px !important",
				right: "25px !important",
				bottom: "auto !important",
			}}
		>
			<Alert
				severity={props.severity}
				onClose={onClose}
				sx={{
					position: "relative",
					minWidth: "375px",
					fontStyle: "italic",
					backgroundColor: "background.paper",
				}}
			>
				<AlertTitle sx={{ fontWeight: "bold", fontStyle: "normal" }}>
					{props.title.toUpperCase()}
				</AlertTitle>
				{props.message}
			</Alert>
		</Snackbar>
	);
}
