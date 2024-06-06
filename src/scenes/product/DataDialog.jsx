import { Formik } from "formik";
import * as yup from "yup";
import {
	Autocomplete,
	Box,
	Checkbox,
	Divider,
	FormControlLabel,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import Dialog from "../../components/customs/Dialog";
import AutoCompleteField from "../../components/customs/AutoCompleteField";
import { useContext, useEffect, useState } from "react";
import AxiosInstance from "../../api/api";
import { DATA_NOTICE } from "../../notice";
import { ColorModeContext } from "../../theme";

const initialValues = {
	name: "",
	unit: "",
	category: "",
	inventory: 0,
	price: 0,
	in_stock: false,
};

const validationSchema = yup.object({
	name: yup.string().trim().required("Field is required!"),
	category: yup
		.mixed()
		.nullable()
		.when([], {
			is: (value) => typeof value === "string",
			then: yup.string().trim("Field is not valid!").strict(true),
		}),
	unit: yup
		.string()
		.trim("Field is not valid!")
		.required("Field is required!")
		.strict(true),
});

export default function DataDialog({
	isOpened,
	handleClose,
	handleFormSubmit,
	data: { units, selectedRow },
}) {
	// CONTROL INITIAL VALUES.
	let convertedValues = { ...initialValues };
	if (Boolean(selectedRow.id)) {
		convertedValues = { ...convertedValues, ...selectedRow };
	}
	// API.
	const [categories, setCategories] = useState([]);
	const { setAlert } = useContext(ColorModeContext);
	useEffect(() => {
		AxiosInstance.get("api/web/category/")
			.then((response) => setCategories(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	}, []);

	return (
		<Dialog
			isOpened={isOpened}
			handleClose={handleClose}
			title="MODIFY PRODUCT"
		>
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
								{/* CHANGABLE FIELDS */}
								<TextField
									name="name"
									label="NAME"
									type="text"
									value={values.name}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!touched.name && !!errors.name}
									helperText={touched.name && errors.name}
									sx={{ gridColumn: "span 2" }}
									fullWidth
								/>
								<AutoCompleteField
									name="category"
									options={categories}
									value={values.category}
									onBlur={handleBlur}
									style={{ gridColumn: "span 2" }}
									error={
										!!touched.category && !!errors.category
									}
									helperText={
										touched.category && errors.category
									}
									setValue={(value) => {
										values.category = value;
									}}
								/>
								<Autocomplete
									name="unit-field"
									freeSolo
									options={units}
									value={values.unit || null}
									onBlur={handleBlur}
									onChange={(_, value) => {
										values.unit = value;
										if (values.unit === null)
											values.unit = "";
									}}
									onInputChange={(event) => {
										if (event === null) return;
										values.unit = event.target.value;
									}}
									sx={{ gridColumn: "span 2" }}
									renderOption={(
										{ key, ...props },
										option
									) => (
										<li
											key={key}
											{...props}
											style={{
												padding: "15px",
												fontStyle: "italic",
											}}
										>
											{option}
										</li>
									)}
									renderInput={(params) => (
										<TextField
											{...params}
											name="unit"
											label="UNIT"
											error={
												!!touched.unit && !!errors.unit
											}
											helperText={
												touched.unit && errors.unit
											}
										/>
									)}
								/>
								<FormControlLabel
									label="IN STOCK"
									control={
										<Checkbox
											name="in_stock"
											checked={values.in_stock}
											onBlur={handleBlur}
											onChange={handleChange}
											color="success"
										/>
									}
								/>
								{/* UNCHANGABLE FIELDS */}
								<Divider sx={{ gridColumn: "span 4" }} />
								<TextField
									name="inventory"
									label="INVENTORY"
									type="number"
									value={values.inventory}
									onBlur={handleBlur}
									onChange={handleChange}
									error={
										!!touched.inventory &&
										!!errors.inventory
									}
									helperText={
										touched.inventory && errors.inventory
									}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									disabled
								/>
								<TextField
									name="price"
									label="PRICE"
									type="number"
									value={values.price}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!touched.price && !!errors.price}
									helperText={touched.price && errors.price}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									disabled
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
