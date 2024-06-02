import * as yup from "yup";
import { Formik } from "formik";
import { Box, Link, Typography } from "@mui/material";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import PasswordField from "../../components/customs/PasswordField";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import AxiosInstance from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../api/constants";
import { useState } from "react";
import AlertDialog from "../../components/AlertDialog";

const validationSchema = yup.object({
	username: yup.string().required("Username is required!"),
	password: yup.string().required("Password is required!"),
});

export default function Login() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();
	const [alert, setAlert] = useState({
		open: false,
		title: "",
		message: "",
		severity: "",
	});

	const closeAlert = () => {
		setAlert({
			open: false,
			title: "",
			message: "",
			severity: "",
		});
	};

	// CALL API LOGIN.
	const handleFormSubmit = async (values, { setSubmitting }) => {
		try {
			const response = await AxiosInstance.post("api/web/login/", values);
			if (response.status !== 200) return;

			localStorage.setItem(ACCESS_TOKEN, response.data["token"]);
			navigate("/");
		} catch (error) {
			setAlert({
				open: true,
				title: "Failed to login",
				message: "Username or password is not correct!",
				severity: "error",
			});
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
							<PasswordField
								name="password"
								label="PASSWORD"
								color="secondary"
								style={{ width: "100%" }}
								value={values.password}
								handleBlur={handleBlur}
								handleChange={handleChange}
								error={
									Boolean(submitCount > 0) &&
									Boolean(touched.password) &&
									Boolean(errors.password)
								}
								helperText={
									Boolean(submitCount > 0) &&
									touched.password &&
									errors.password
								}
							/>
							<Link
								href="/forgot-password"
								underline="none"
								fontStyle="italic"
								color={colors.grey[400]}
								marginLeft="auto"
								tabIndex={-1}
							>
								Forgot password ?
							</Link>

							<Button
								label="LOGIN"
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

			<AlertDialog {...alert} onClose={closeAlert} />
		</Box>
	);
}
