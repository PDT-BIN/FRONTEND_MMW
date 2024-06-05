import { useContext, useEffect, useState } from "react";
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
import AxiosInstance from "../../api/api";
import { ColorModeContext } from "../../theme";
import {
	APPLY_PRICE_SUCCESS,
	DOWNLOAD_FAILED,
	DOWNLOAD_SUCCESS,
} from "../../notice";

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
	const { setAlert } = useContext(ColorModeContext);
	// REFRESH.
	useEffect(() => {
		setActiveStep(0);
		setUploadFile(null);
	}, [isOpened]);

	const handleStep = (step) => () => {
		setActiveStep(step);
	};

	// CALL API DOWNLOAD SYSTEM PRICELIST FILE.
	const handleDownload = async () => {
		try {
			const response = await AxiosInstance.get(
				"api/web/download_excel/",
				{ responseType: "blob" }
			);
			// STORE FILE.
			const blob = new Blob([response.data]);
			const downloadUrl = window.URL.createObjectURL(blob);
			// DOWNLOAD FILE.
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.setAttribute("download", REQUIRED_FILE);
			document.body.appendChild(link);
			link.click();
			link.remove();

			setAlert(DOWNLOAD_SUCCESS);
		} catch {
			setAlert(DOWNLOAD_FAILED);
		}
	};

	const handleUpload = (event) => {
		setUploadFile(event.target.files[0]);
	};

	// CALL API APPLY PRICELIST TO PRODUCTS.
	const handleApplyPrice = async () => {
		try {
			// SEND TO SERVER.
			await AxiosInstance.post(
				"api/web/upload_excel/",
				{ file: uploadFile },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setAlert(APPLY_PRICE_SUCCESS);
			handleClose();
		} catch {
			setAlert(APPLY_PRICE_SUCCESS);
		}
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
