import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useState } from "react";
import { EMPTY_NOTICE } from "../notice";

export let control;

export default function AlertDialog() {
	const [props, setProps] = useState({
		open: false,
		title: "",
		message: "",
		severity: "",
	});
	control = setProps;

	const closeDialog = () => {
		setProps(EMPTY_NOTICE);
	};

	return (
		<Snackbar
			open={props.open}
			onClose={closeDialog}
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
				onClose={closeDialog}
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
