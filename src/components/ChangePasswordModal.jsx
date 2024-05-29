import { Box, DialogActions } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Dialog from "./customs/Dialog";
import Button from "./customs/Button";
import PasswordField from "./customs/PasswordField";

const initialValues = {
	current_password: "",
	changed_password: "",
	confirm_password: "",
};

const validationSchema = yup.object({
	current_password: yup.string().trim().required("Field is required!"),
	changed_password: yup.string().trim().required("Field is required!"),
	confirm_password: yup
		.string()
		.trim()
		.oneOf(
			[yup.ref("changed_password"), null],
			"Confirm password must match changed password!"
		)
		.required("Field is required!"),
});

export default function ChangePasswordModal({
	isOpened,
	handleClose,
	handleFormSubmit,
}) {
	return (
		<Dialog
			title="CHANGE YOUR PASSWORD"
			isOpened={isOpened}
			handleClose={handleClose}
		>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleFormSubmit}
			>
				{({
					values,
					errors,
					touched,
					isSubmitting,
					submitCount,
					handleBlur,
					handleChange,
					handleSubmit,
				}) => (
					<form onSubmit={handleSubmit}>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							gap="25px"
						>
							<PasswordField
								name="current_password"
								label="CURRENT PASSWORD"
								color="secondary"
								style={{ width: "75%" }}
								value={values.current_password}
								handleBlur={handleBlur}
								handleChange={handleChange}
								error={
									submitCount > 0 &&
									Boolean(touched.current_password) &&
									Boolean(errors.current_password)
								}
								helperText={
									submitCount > 0 &&
									touched.current_password &&
									errors.current_password
								}
							/>
							<PasswordField
								name="changed_password"
								label="CHANGED PASSWORD"
								color="secondary"
								style={{ width: "75%" }}
								value={values.changed_password}
								handleBlur={handleBlur}
								handleChange={handleChange}
								error={
									submitCount > 0 &&
									Boolean(touched.changed_password) &&
									Boolean(errors.changed_password)
								}
								helperText={
									submitCount > 0 &&
									touched.changed_password &&
									errors.changed_password
								}
							/>
							<PasswordField
								name="confirm_password"
								label="CONFIRM PASSWORD"
								color="secondary"
								style={{ width: "75%" }}
								value={values.confirm_password}
								handleBlur={handleBlur}
								handleChange={handleChange}
								error={
									submitCount > 0 &&
									Boolean(touched.confirm_password) &&
									Boolean(errors.confirm_password)
								}
								helperText={
									submitCount > 0 &&
									touched.confirm_password &&
									errors.confirm_password
								}
							/>
						</Box>

						<DialogActions
							sx={{
								mt: "25px",
								justifyContent: "center",
								gap: "10px",
							}}
						>
							<Button
								label="CONFIRM"
								variant="contained"
								type="submit"
								disabled={isSubmitting}
								style={{
									width: "20%",
									padding: "10px",
									color: "white",
								}}
							/>
							<Button
								label="CANCEL"
								variant="contained"
								onClick={handleClose}
								style={{
									width: "20%",
									padding: "10px",
									color: "white",
								}}
							/>
						</DialogActions>
					</form>
				)}
			</Formik>
		</Dialog>
	);
}
