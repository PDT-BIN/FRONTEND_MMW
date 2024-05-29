import { useEffect, useState } from "react";
import {
	Box,
	DialogActions,
	Step,
	StepButton,
	StepContent,
	Stepper,
	Typography,
	styled,
} from "@mui/material";
import Dialog from "../../components/customs/Dialog";
import Button from "../../components/customs/Button";
import { REQUIRED_FILE } from "../constants";

const VISUALLY_HIDDEN_INPUT = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export const STEPS = [
	{
		label: "DOWNLOAD SYSTEM FILE",
		content: (handleClick) => (
			<Button
				label="DOWNLOAD"
				variant="contained"
				onClick={handleClick}
				style={{
					marginY: "10px",
					width: "120px",
					padding: "10px",
					color: "white",
				}}
			/>
		),
	},
	{
		label: "UPLOAD YOUR MODIFIED SYSTEM FILE",
		content: (handleClick) => (
			<Button
				component="label"
				label="UPLOAD"
				variant="contained"
				style={{
					marginY: "10px",
					width: "120px",
					padding: "10px",
					color: "white",
				}}
				hiddenInput={
					<VISUALLY_HIDDEN_INPUT type="file" onChange={handleClick} />
				}
			/>
		),
	},
];

export default function PriceDialog({ isOpened, handleClose }) {
	const [activeStep, setActiveStep] = useState(0);
	const [uploadFile, setUploadFile] = useState(null);
	// REFRESH.
	useEffect(() => {
		setActiveStep(0);
		setUploadFile(null);
	}, [isOpened]);

	const handleStep = (step) => () => {
		setActiveStep(step);
	};

	const handleDownload = () => {
		// CALL API DOWNLOAD SYSTEM PRICELIST FILE.
	};

	const handleUpload = (event) => {
		setUploadFile(event.target.files[0]);
	};

	const handleApplyPrice = () => {
		// CALL API APPLY PRICELIST TO PRODUCTS.
		handleClose();
	};

	return (
		<Dialog
			isOpened={isOpened}
			handleClose={handleClose}
			title="ESTABLISH PRICE"
		>
			<Box
				display="flex"
				justifyContent="space-between"
				sx={{ "& .MuiStepConnector-line": { minHeight: 0 } }}
			>
				<Stepper
					nonLinear
					orientation="vertical"
					activeStep={activeStep}
				>
					{STEPS.map((step, index) => (
						<Step key={step.label}>
							<StepButton
								color="inherit"
								onClick={handleStep(index)}
							>
								{step.label}
							</StepButton>
							<StepContent>
								{step.content(
									index === 0 ? handleDownload : handleUpload
								)}
							</StepContent>
						</Step>
					))}
				</Stepper>
				<Box display="flex" flexDirection="column" gap="10px">
					<Typography fontStyle="italic" color="secondary">
						REQUIRED FILE: {REQUIRED_FILE}
					</Typography>
					<Typography
						fontStyle="italic"
						color={
							uploadFile?.name === REQUIRED_FILE
								? "secondary"
								: "orange"
						}
					>
						UPLOADED FILE: {uploadFile?.name || ""}
					</Typography>
				</Box>
			</Box>

			<DialogActions sx={{ mt: "25px", gap: "10px" }}>
				<Button
					label="APPLY"
					variant="contained"
					onClick={handleApplyPrice}
					disabled={uploadFile?.name !== REQUIRED_FILE}
					style={{
						width: "15%",
						padding: "10px",
						color: "white",
					}}
				/>
				<Button
					label="CANCEL"
					variant="contained"
					onClick={handleClose}
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
