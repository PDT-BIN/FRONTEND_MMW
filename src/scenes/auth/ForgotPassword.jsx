import * as yup from "yup";
import { Formik } from "formik";
import { Box, Link, Typography } from "@mui/material";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const validationSchema = yup.object({
	username: yup.string().required("Username is required!"),
	email: yup
		.string()
		.required("Email is required!")
		.email("Field must be an email!"),
});

const handleFormSubmit = (values, { setSubmitting }) => {
	// CALL API GET RESET-PASSWORD EMAIL.
	setSubmitting(false);
};

export default function ForgotPassword() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

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
					FORGOT PASSWORD
				</Typography>
				<Formik
					initialValues={{ username: "", email: "" }}
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
							<TextField
								name="username"
								label="USERNAME"
								color="secondary"
								style={{ width: "100%" }}
								value={values.username}
								onBlur={handleBlur}
								onChange={handleChange}
								error={
									Boolean(submitCount > 0) &&
									Boolean(touched.username) &&
									Boolean(errors.username)
								}
								helperText={
									Boolean(submitCount > 0) &&
									touched.username &&
									errors.username
								}
								autoFocus
							/>
							<TextField
								name="email"
								label="EMAIL"
								type="email"
								color="secondary"
								style={{ width: "100%" }}
								value={values.email}
								onBlur={handleBlur}
								onChange={handleChange}
								error={
									Boolean(submitCount > 0) &&
									Boolean(touched.email) &&
									Boolean(errors.email)
								}
								helperText={
									Boolean(submitCount > 0) &&
									touched.email &&
									errors.email
								}
							/>
							<Link
								href="/login"
								underline="none"
								fontStyle="italic"
								color={colors.grey[400]}
								marginLeft="auto"
								tabIndex={-1}
							>
								Back to login ?
							</Link>

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
