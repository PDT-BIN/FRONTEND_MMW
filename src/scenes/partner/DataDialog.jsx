import { Formik } from "formik";
import * as yup from "yup";
import { useEffect, useRef } from "react";
import { Box, MenuItem } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import {
	ProvinceField,
	DistrictField,
	WardField,
} from "../../components/customs/AddressField";
import Dialog from "../../components/customs/Dialog";
import { AddressUtil } from "../../utils";
import { GENDERS } from "../constants";

const initialValues = {
	name: "",
	gender: "",
	ward: "",
	district: "",
	province: "",
	email: "",
	company: "",
	taxcode: "",
};

const validationSchema = yup.object({
	name: yup.string().trim().required("Field is required!"),
	email: yup
		.string()
		.trim("Field expects an email address!")
		.email("Field is not valid!")
		.required("Field is required!")
		.strict(true),
	province: yup.string().required("Field is required!"),
	taxcode: yup
		.string()
		.trim("Field expects a taxcode!")
		.matches(/^\d{10}$/, "Taxcode must have the lenght of 10!")
		.strict(true),
});

function DataDialog({
	isOpened,
	handleClose,
	handleFormSubmit,
	title,
	data: { address, birthdate, ...data },
}) {
	// CONTROL ADDRESS DISABILITY.
	const selectedProvince = useRef("");
	const selectedDistrict = useRef("");
	// CONTROL INITIAL VALUES.
	let convertedValues = { ...initialValues };
	if (Boolean(data.id)) {
		convertedValues = {
			...convertedValues,
			...data,
			...AddressUtil.analyze(address),
		};
	}
	// CONTROL REF VALUES.
	useEffect(() => {
		selectedProvince.current = convertedValues.province;
		selectedDistrict.current = convertedValues.district;
	}, [isOpened]);

	return (
		<Dialog isOpened={isOpened} handleClose={handleClose} title={title}>
			<Formik
				initialValues={convertedValues}
				validationSchema={validationSchema}
				onSubmit={handleFormSubmit}
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
					<form onSubmit={handleSubmit}>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<Box
								display="grid"
								gap="30px"
								gridTemplateColumns="repeat(4, minmax(0, 1fr))"
								sx={{
									"& .MuiFormHelperText-root": {
										fontStyle: "italic",
									},
								}}
							>
								<TextField
									name="name"
									label="FULL NAME"
									type="text"
									value={values.name}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!touched.name && !!errors.name}
									helperText={touched.name && errors.name}
									sx={{ gridColumn: "span 2" }}
									fullWidth
								/>
								<TextField
									name="gender"
									label="GENDER"
									type="text"
									value={values.gender}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!touched.gender && !!errors.gender}
									helperText={touched.gender && errors.gender}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									select
								>
									{GENDERS.map((option) => (
										<MenuItem
											key={option.value}
											value={option.value}
											sx={{
												padding: "10px",
												fontStyle: "italic",
											}}
										>
											{option.label}
										</MenuItem>
									))}
								</TextField>
								<TextField
									name="email"
									label="EMAIL"
									type="text"
									value={values.email}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!touched.email && !!errors.email}
									helperText={touched.email && errors.email}
									sx={{ gridColumn: "span 2" }}
									fullWidth
								/>
								<TextField
									name="taxcode"
									label="TAXCODE"
									type="text"
									value={values.taxcode}
									onBlur={handleBlur}
									onChange={handleChange}
									error={
										!!touched.taxcode && !!errors.taxcode
									}
									helperText={
										touched.taxcode && errors.taxcode
									}
									sx={{ gridColumn: "span 2" }}
									fullWidth
								/>
								<Box
									gridColumn="span 4"
									display="grid"
									gap="30px"
									gridTemplateColumns="repeat(3, minmax(0, 1fr))"
								>
									<ProvinceField
										name="province"
										label="PROVINCE"
										type="text"
										value={values.province}
										onBlur={handleBlur}
										onChange={(e, { props: { value } }) => {
											selectedProvince.current = value;
											// RESET DISTRICT & WARD WHEN CHANGING PROVINCE.
											values.district = "";
											values.ward = "";
											selectedDistrict.current = "";
											handleChange(e);
										}}
										error={
											!!touched.province &&
											!!errors.province
										}
										helperText={
											touched.province && errors.province
										}
										sx={{ gridColumn: "span 1" }}
										fullWidth
										select
									/>
									<DistrictField
										name="district"
										label="DISTRICT"
										type="text"
										value={values.district}
										onBlur={handleBlur}
										onChange={(e, { props: { value } }) => {
											selectedDistrict.current = value;
											// RESET WARD WHEN CHANGING DISTRICT.
											values.ward = "";
											handleChange(e);
										}}
										error={
											!!touched.district &&
											!!errors.district
										}
										helperText={
											touched.district && errors.district
										}
										sx={{ gridColumn: "span 1" }}
										selectedProvince={
											selectedProvince.current
										}
										fullWidth
										select
									/>
									<WardField
										name="ward"
										label="WARD"
										type="text"
										value={values.ward}
										onBlur={handleBlur}
										onChange={handleChange}
										error={!!touched.ward && !!errors.ward}
										helperText={touched.ward && errors.ward}
										sx={{ gridColumn: "span 1" }}
										selectedDistrict={
											selectedDistrict.current
										}
										fullWidth
										select
									/>
								</Box>
								<TextField
									name="company"
									label="COMPANY"
									type="text"
									value={values.company}
									onBlur={handleBlur}
									onChange={handleChange}
									error={
										!!touched.company && !!errors.company
									}
									helperText={
										touched.company && errors.company
									}
									sx={{ gridColumn: "span 2" }}
									fullWidth
								/>
							</Box>

							<DialogActions sx={{ mt: "25px", gap: "10px" }}>
								<Button
									label="SUBMIT"
									variant="contained"
									type="submit"
									disabled={isSubmitting}
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
						</LocalizationProvider>
					</form>
				)}
			</Formik>
		</Dialog>
	);
}

export default DataDialog;
