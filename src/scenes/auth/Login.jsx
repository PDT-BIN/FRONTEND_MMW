import * as yup from "yup";
import { Formik } from "formik";
import { Box, Typography } from "@mui/material";
import TextField from "../../components/customs/TextField";
import Button from "../../components/customs/Button";

const validationSchema = yup.object({
	username: yup.string().required("Username is required!"),
	password: yup.string().required("Password is required!"),
});

const handleFormSubmit = (values, { setSubmitting }) => {
	// CALL API LOGIN.
	setSubmitting(false);
};

const Login = () => {
	return (
		<Box
			width="100%"
			height="100%"
			display="flex"
			justifyContent="center"
			alignItems="center"
			sx={{
				backgroundImage: "url(src/assets/bg_login.png)",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<Box
				width="35%"
				height="75%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				gap="50px"
				borderRadius="10px"
				sx={{ backdropFilter: "blur(20px)" }}
			>
				<Typography
					variant="h2"
					fontWeight="bold"
					color="secondary"
					letterSpacing={3}
				>
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
								type="text"
								value={values.username}
								onBlur={handleBlur}
								onChange={handleChange}
								error={!!touched.username && !!errors.username}
								helperText={touched.username && errors.username}
							/>
							<TextField
								name="password"
								label="PASSWORD"
								color="secondary"
								style={{ width: "80%" }}
								type="password"
								value={values.password}
								onBlur={handleBlur}
								onChange={handleChange}
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
};

export default Login;
