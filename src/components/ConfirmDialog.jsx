import { DialogActions, DialogContentText } from "@mui/material";
import Button from "./customs/Button";
import Dialog from "./customs/Dialog";

const DialogDescription = ({ content }) => {
	return (
		<DialogContentText sx={{ pb: "20px", color: "white" }}>
			{content}
		</DialogContentText>
	);
};

function ConfirmDialog(props) {
	return (
		<Dialog
			isOpened={props.isOpened}
			handleClose={props.handleClose}
			title={props.title}
			content={<DialogDescription content={props.content} />}
		>
			<DialogActions sx={{ gap: "10px" }}>
				<Button
					label="CONFIRM"
					variant="contained"
					onClick={props.handleFormSubmit}
					style={{
						width: "15%",
						padding: "10px",
						color: "white",
					}}
				/>
				<Button
					label="CANCEL"
					variant="contained"
					onClick={props.handleClose}
					style={{
						width: "15%",
						padding: "10px",
						color: "white",
					}}
				/>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
