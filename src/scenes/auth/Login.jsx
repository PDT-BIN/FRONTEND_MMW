import * as yup from "yup";
import { Formik } from "formik";
import { Box, Typography, colors } from "@mui/material";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import PasswordField from "../../components/customs/PasswordField";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const validationSchema = yup.object({
	username: yup.string().required("Username is required!"),
	password: yup.string().required("Password is required!"),
});

const handleFormSubmit = (values, { setSubmitting }) => {
	// CALL API LOGIN.
	setSubmitting(false);
};

export default function Login() {
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
					ADMINISTRATOR
				</Typography>
				<Formik
					initialValues={{ username: "", password: "" }}
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
						<form
							onSubmit={handleSubmit}
							style={{
								width: "100%",
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
								style={{ width: "80%" }}
								value={values.username}
								onBlur={handleBlur}
								onChange={handleChange}
								error={!!touched.username && !!errors.username}
								helperText={touched.username && errors.username}
							/>
							<PasswordField
								name="password"
								label="PASSWORD"
								color="secondary"
								style={{ width: "80%" }}
								value={values.password}
								handleBlur={handleBlur}
								handleChange={handleChange}
								error={!!touched.password && !!errors.password}
								helperText={touched.password && errors.password}
							/>

							<Button
								label="LOGIN"
								variant="contained"
								type="submit"
								color="secondary"
								disabled={isSubmitting}
								style={{
									marginTop: "50px",
									width: "80%",
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
