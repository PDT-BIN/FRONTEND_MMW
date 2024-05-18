import { Formik } from "formik";
import * as yup from "yup";
import { Autocomplete, Box, Divider } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import Dialog from "../../components/customs/Dialog";

const initialValues = {
	name: "",
	unit: "",
	category: null,
	inventory: 0,
	price: 0,
};

const validationSchema = yup.object({
	name: yup.string().trim().required("Field is required!"),
	category: yup.mixed().when([], {
		is: (value) => typeof value === "string",
		then: yup.string().trim("Field is not valid!").strict(true),
	}),
	unit: yup
		.string()
		.trim("Field is not valid!")
		.required("Field is required!")
		.strict(true),
});

function DataDialog({
	isOpened,
	handleClose,
	handleFormSubmit,
	title,
	data: { categories, units, selectedRow },
}) {
	// CONTROL INITIAL VALUES.
	let convertedValues = { ...initialValues };
	if (Boolean(selectedRow.id)) {
		convertedValues = { ...convertedValues, ...selectedRow };
	}

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
								<Autocomplete
									name="category-field"
									freeSolo
									options={categories}
									getOptionLabel={(option) =>
										option.name || option
									}
									groupBy={(option) => option.name[0]}
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
											{option.name}
										</li>
									)}
									value={values.category?.name || null}
									onBlur={handleBlur}
									onChange={(e, value) => {
										values.category = value;
										if (values.category === null)
											values.category = "";
									}}
									onInputChange={(event) => {
										if (event === null) return;
										values.category = event.target.value;
									}}
									sx={{ gridColumn: "span 2" }}
									renderInput={(params) => (
										<TextField
											{...params}
											name="category"
											label="CATEGORY"
											error={
												!!touched.category &&
												!!errors.category
											}
											helperText={
												touched.category &&
												errors.category
											}
										/>
									)}
								/>
								<Autocomplete
									name="unit-field"
									freeSolo
									options={units}
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
									value={values.unit || null}
									onBlur={handleBlur}
									onChange={(e, value) => {
										values.unit = value;
										if (values.unit === null)
											values.unit = "";
									}}
									onInputChange={(event) => {
										if (event === null) return;
										values.unit = event.target.value;
									}}
									sx={{ gridColumn: "span 2" }}
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

export default DataDialog;
