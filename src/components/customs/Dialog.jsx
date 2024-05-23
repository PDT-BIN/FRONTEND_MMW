import { Box, Dialog as MDialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

export default function Dialog({ children, title, content, ...props }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<MDialog
			fullWidth
			maxWidth="xl"
			open={props.isOpened}
			onClose={props.handleClose}
			PaperProps={{
				sx: {
					width: "50%",
					backgroundColor: colors.primary[400],
					"& .MuiDialogContent-root": {
						padding: "25px 25px 10px 25px !important",
					},
					...props.style,
				},
			}}
		>
			{/* DIALOG TITLE */}
			<DialogTitle sx={{ backgroundColor: colors.blueAccent[700] }}>
				{title}
			</DialogTitle>
			{/* DIALOG BODY */}
			<DialogContent>
				{/* DIALOG DESCRIPTION */}
				<Box>{content}</Box>
				{/* DIALOG CONTENT */}
				<Box>{children}</Box>
			</DialogContent>
		</MDialog>
	);
}
