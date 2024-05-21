import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Box } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import { DateTimeUtil } from "../../utils";
import { mockDataDepot, mockDataPartner } from "../../data/mockData";
import AutoCompleteField from "../../components/customs/AutoCompleteField";

const initialValues = {
	created_date: DateTimeUtil.format(Date.now()),
	partner: null,
	depot: null,
	total: 0,
};

const validationSchema = yup.object({
	partner: yup.mixed().required("Field is required!"),
	depot: yup.mixed().required("Field is required!"),
});

function DataForm({ handleFormSubmit, data }) {
	// CONTROL INITIAL VALUES.
	let convertedValues = { ...initialValues };
	if (Boolean(data.id)) {
		convertedValues = { ...convertedValues, ...data };
	}

	const [DEPOTS, setDepots] = useState([]);
	const [PARTNERS, setPartners] = useState([]);
	useEffect(() => {
		// CALL API GET DEPOT & PARTNER DATA.
		setDepots(mockDataDepot.sort((a, b) => a.name.localeCompare(b.name)));
		setPartners(
			mockDataPartner.sort((a, b) => a.name.localeCompare(b.name))
		);
	}, []);

	return (
		<Formik
			initialValues={convertedValues}
			validationSchema={validationSchema}
			onSubmit={handleFormSubmit}
			enableReinitialize={true}
		>
			{({
				values,
				errors,
				touched,
				isSubmitting,
				handleBlur,
				handleChange,
				handleSubmit,
			}) => (
				<form onSubmit={handleSubmit} style={{ height: "100%" }}>
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<Box
							height="100%"
							display="flex"
							flexDirection="column"
							justifyContent="space-between"
						>
							<Box
								display="grid"
								gap="20px"
								gridTemplateColumns="repeat(4, minmax(0, 1fr))"
								sx={{
									"& .MuiFormHelperText-root": {
										fontStyle: "italic",
									},
								}}
							>
								<TextField
									name="created_date"
									label="CREATED_DATE"
									type="text"
									value={values.created_date}
									onBlur={handleBlur}
									onChange={handleChange}
									error={
										!!touched.created_date &&
										!!errors.created_date
									}
									helperText={
										touched.created_date &&
										errors.created_date
									}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									disabled
								/>
								<TextField
									name="total"
									label="TOTAL"
									type="text"
									value={values.total}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!touched.total && !!errors.total}
									helperText={touched.total && errors.total}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									disabled
								/>
								<AutoCompleteField
									name="partner"
									options={PARTNERS}
									value={values.partner}
									onBlur={handleBlur}
									style={{ gridColumn: "span 4" }}
									error={
										!!touched.partner && !!errors.partner
									}
									helperText={
										touched.partner && errors.partner
									}
									setValue={(value) =>
										(values.partner = value)
									}
									freeSolo={false}
									onInputChange={null}
								/>
								<AutoCompleteField
									name="depot"
									options={DEPOTS}
									value={values.depot}
									onBlur={handleBlur}
									style={{ gridColumn: "span 4" }}
									error={!!touched.depot && !!errors.depot}
									helperText={touched.depot && errors.depot}
									setValue={(value) => (values.depot = value)}
									freeSolo={false}
									onInputChange={null}
								/>
							</Box>

							<DialogActions
								sx={{
									p: "0",
									mt: "20px",
									justifyContent: "center",
								}}
							>
								<Button
									label="SUBMIT"
									variant="contained"
									type="submit"
									disabled={isSubmitting}
									style={{
										width: "25%",
										padding: "10px",
										color: "white",
									}}
								/>
							</DialogActions>
						</Box>
					</LocalizationProvider>
				</form>
			)}
		</Formik>
	);
}

export default DataForm;
