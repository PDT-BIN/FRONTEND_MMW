import moment from "moment";
import { Formik } from "formik";
import * as yup from "yup";
import { useEffect, useRef } from "react";
import {
	Box,
	Checkbox,
	Divider,
	FormControlLabel,
	MenuItem,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Dialog from "./customs/Dialog";
import Button from "./customs/Button";
import TextField from "./customs/TextField";
import {
	ProvinceField,
	DistrictField,
	WardField,
} from "./customs/AddressField";
import { AddressUtil } from "../utils";
import { PHONE_REGEX, GENDERS, ROLES } from "../scenes/constants";

const initialValues = {
	first_name: "",
	last_name: "",
	gender: "",
	birthdate: null,
	ward: "",
	district: "",
	province: "",
	email: "",
	phone: "",
	is_superuser: false,
	is_active: false,
};

const validationSchema = yup.object({
	last_name: yup.string().trim().required("Field is required!"),
	first_name: yup.string().trim().required("Field is required!"),
	email: yup
		.string()
		.trim("Field expects an email address!")
		.email("Field is not valid!")
		.required("Field is required!")
		.strict(true),
	phone: yup
		.string()
		.trim("Field expects a phone number!")
		.matches(PHONE_REGEX, "Field is not valid!")
		.required("Field is required!")
		.strict(true),
});

const alterValues = ({ birthdate, address, ...data }) => {
	if (!data.hasOwnProperty("id")) return initialValues;
	return {
		...initialValues,
		...data,
		...AddressUtil.analyze(address),
		birthdate: !Boolean(birthdate) ? null : moment(birthdate, "DD/MM/YYYY"),
	};
};

export default function ProfileModal({
	isPersonal = false,
	title,
	isOpened,
	handleClose,
	handleFormSubmit,
	data,
}) {
	// CONTROL ADDRESS DISABILITY.
	const selectedProvince = useRef("");
	const selectedDistrict = useRef("");
	// CONTROL INITIAL VALUES.
	let convertedValues = alterValues(data);
	// CONTROL REF VALUES.
	selectedProvince.current = convertedValues.province;
	selectedDistrict.current = convertedValues.district;

	return (
		<Dialog title={title} isOpened={isOpened} handleClose={handleClose}>
			<Formik
				initialValues={convertedValues}
				validationSchema={validationSchema}
				onSubmit={handleFormSubmit}
				enableReinitialize
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
								{/* PERSONAL INFORMATION */}
								<TextField
									name="last_name"
									label="LAST NAME"
									type="text"
									value={values.last_name}
									onBlur={handleBlur}
									onChange={handleChange}
									error={
										!!touched.last_name &&
										!!errors.last_name
									}
									helperText={
										touched.last_name && errors.last_name
									}
									sx={{ gridColumn: "span 2" }}
									fullWidth
								/>
								<TextField
									name="first_name"
									label="FIRST NAME"
									type="text"
									value={values.first_name}
									onBlur={handleBlur}
									onChange={handleChange}
									error={
										!!touched.first_name &&
										!!errors.first_name
									}
									helperText={
										touched.first_name && errors.first_name
									}
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
								<DatePicker
									name="birthdate"
									label="BIRTHDATE"
									format="DD/MM/YYYY"
									value={values.birthdate}
									onChange={(value) =>
										(values.birthdate = value)
									}
									sx={{ gridColumn: "span 2" }}
								/>
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
									name="phone"
									label="PHONE NUMBER"
									type="text"
									value={values.phone}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!touched.phone && !!errors.phone}
									helperText={touched.phone && errors.phone}
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
								{/* ACCOUNT INFORMATION */}
								{!isPersonal && (
									<>
										<Divider
											sx={{ gridColumn: "span 4" }}
										/>
										<TextField
											name="is_superuser"
											label="ROLE"
											type="text"
											value={values.is_superuser}
											onBlur={handleBlur}
											onChange={handleChange}
											error={
												!!touched.is_superuser &&
												!!errors.is_superuser
											}
											helperText={
												touched.is_superuser &&
												errors.is_superuser
											}
											sx={{ gridColumn: "span 2" }}
											fullWidth
											select
										>
											{ROLES.map((option) => (
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
										<FormControlLabel
											label="ACTIVE"
											control={
												<Checkbox
													name="is_active"
													checked={values.is_active}
													onBlur={handleBlur}
													onChange={handleChange}
													color="success"
												/>
											}
										/>
									</>
								)}
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
