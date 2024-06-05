import { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Box } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import { DateTimeUtil } from "../../utils";
import AutoCompleteField from "../../components/customs/AutoCompleteField";
import AxiosInstance from "../../api/api";
import { ColorModeContext } from "../../theme";
import { DATA_NOTICE } from "../../notice";
import { USER_ID } from "../../api/constants";

const initialValues = {
	created_date: DateTimeUtil.format(Date.now()),
	partner: null,
};

const validationSchema = yup.object({
	partner: yup.mixed().required("Field is required!"),
});

function DataForm({
	handleFormSubmit,
	handleFormCancel,
	form,
	total,
	canModify,
}) {
	// CONTROL INITIAL VALUES.
	let convertedValues = { ...initialValues };
	if (Boolean(form.id)) {
		convertedValues = { ...convertedValues, ...form };
	}
	// CALL API GET DEPOT & PARTNER DATA.
	const [depots, setDepots] = useState([]);
	const [partners, setPartners] = useState([]);
	const { setAlert } = useContext(ColorModeContext);
	useEffect(() => {
		AxiosInstance.get("api/web/business_Partner/")
			.then((response) =>
				setPartners(
					response.data.sort((a, b) => a.name.localeCompare(b.name))
				)
			)
			.catch((_) => setAlert(DATA_NOTICE));
		AxiosInstance.get("api/web/depot/")
			.then((response) =>
				setDepots(
					response.data.sort((a, b) => a.name.localeCompare(b.name))
				)
			)
			.catch((_) => setAlert(DATA_NOTICE));
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
									type="number"
									value={total}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									disabled
								/>
								<AutoCompleteField
									name="partner"
									options={partners}
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
									disabled={!canModify}
								/>
								{Boolean(form.id) && (
									<AutoCompleteField
										name="depot"
										options={depots}
										value={values.depot}
										onBlur={handleBlur}
										style={{ gridColumn: "span 4" }}
										error={
											!!touched.depot && !!errors.depot
										}
										helperText={
											touched.depot && errors.depot
										}
										setValue={(value) =>
											(values.depot = value)
										}
										freeSolo={false}
										onInputChange={null}
										disabled
									/>
								)}
							</Box>

							{canModify && (
								<DialogActions
									sx={{
										p: "0",
										mt: "20px",
										justifyContent: "center",
										gap: "20px",
									}}
								>
									<Button
										label={form.id ? "MODIFY" : "CREATE"}
										variant="contained"
										type="submit"
										disabled={isSubmitting}
										style={{
											width: "25%",
											padding: "10px",
											color: "white",
										}}
									/>
									{form.id && (
										<Button
											label={"CANCEL"}
											variant="contained"
											onClick={handleFormCancel}
											style={{
												width: "25%",
												padding: "10px",
												color: "white",
											}}
										/>
									)}
								</DialogActions>
							)}
						</Box>
					</LocalizationProvider>
				</form>
			)}
		</Formik>
	);
}

export default DataForm;
