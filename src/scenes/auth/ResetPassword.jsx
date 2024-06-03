import * as yup from "yup";
import { Formik } from "formik";
import { Box, Typography } from "@mui/material";
import Button from "../../components/customs/Button";
import PasswordField from "../../components/customs/PasswordField";
import { useTheme } from "@emotion/react";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import AxiosInstance from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILED } from "../../notice";

const validationSchema = yup.object({
	changed_password: yup.string().trim().required("New password is required!"),
	confirm_password: yup
		.string()
		.trim()
		.oneOf(
			[yup.ref("changed_password"), null],
			"Confirm password must match changed password!"
		)
		.required("Confirm password is required!"),
});

export default function ResetPassword() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// API.
	const navigate = useNavigate();
	const { token } = useParams();
	const { setAlert } = useContext(ColorModeContext);

	// CALL API RESET PASSWORD.
	const handleFormSubmit = async (values, { setSubmitting }) => {
		try {
			const response = await AxiosInstance.post(
				"api/web/password_reset/confirm/",
				{
					password: values["changed_password"],
					token: token,
				}
			);

			setAlert(RESET_PASSWORD_SUCCESS);
			navigate("/login");
		} catch {
			setAlert(RESET_PASSWORD_FAILED);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Box
			width="100%"
			height="100%"
			display="flex"
			justifyContent="center"
			alignItems="center"
			sx={{
				backgroundColor: "#8BC6EC",
				backgroundImage:
					"linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)",
			}}
		>
			<Box
				width="35%"
				height="70%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				gap="50px"
				bgcolor={colors.primary[400]}
				borderRadius="10px"
			>
				<Typography variant="h2" fontWeight="bold" letterSpacing={3}>
					RESET PASSWORD
				</Typography>
				<Formik
					initialValues={{
						changed_password: "",
						confirm_password: "",
					}}
					validationSchema={validationSchema}
					onSubmit={handleFormSubmit}
				>
					{({
						values,
						errors,
						touched,
						submitCount,
						isSubmitting,
						handleBlur,
						handleChange,
						handleSubmit,
					}) => (
						<form
							onSubmit={handleSubmit}
							style={{
								width: "80%",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "25px",
							}}
						>
							<PasswordField
								name="changed_password"
								label="CHANGED PASSWORD"
								color="secondary"
								style={{ width: "100%" }}
								value={values.changed_password}
								handleBlur={handleBlur}
								handleChange={handleChange}
								error={
									Boolean(submitCount > 0) &&
									Boolean(touched.changed_password) &&
									Boolean(errors.changed_password)
								}
								helperText={
									Boolean(submitCount > 0) &&
									touched.changed_password &&
									errors.changed_password
								}
							/>
							<PasswordField
								name="confirm_password"
								label="CONFIRM PASSWORD"
								color="secondary"
								style={{ width: "100%" }}
								value={values.confirm_password}
								handleBlur={handleBlur}
								handleChange={handleChange}
								error={
									Boolean(submitCount > 0) &&
									Boolean(touched.confirm_password) &&
									Boolean(errors.confirm_password)
								}
								helperText={
									Boolean(submitCount > 0) &&
									touched.confirm_password &&
									errors.confirm_password
								}
							/>

							<Button
								label="CONFIRM"
								variant="contained"
								type="submit"
								color="secondary"
								disabled={isSubmitting}
								style={{
									marginTop: "50px",
									width: "100%",
									padding: "10px",
									color: "white",
									fontWeight: "bold",
									fontSize: "large",
									letterSpacing: 2,
								}}
							/>
						</form>
					)}
				</Formik>
			</Box>
		</Box>
	);
}
