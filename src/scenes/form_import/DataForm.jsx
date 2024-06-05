import { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Box } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "../../components/customs/Button";
import TextField from "../../components/customs/TextField";
import { DateTimeUtil } from "../../utils";
import AutoCompleteField from "../../components/customs/AutoCompleteField";
import AxiosInstance from "../../api/api";
import { ColorModeContext } from "../../theme";
import { DATA_NOTICE } from "../../notice";
import { IS_MANAGER } from "../../api/constants";

const initialValues = {
	created_date: DateTimeUtil.format(Date.now()),
	order: null,
};

const validationSchema = yup.object({
	order: yup.mixed().required("Field is required!"),
});

function DataForm({
	handleFormSubmit,
	handleFormCancel,
	form,
	total,
	selectedOrder,
	setSelectedOrder,
}) {
	const CAN_MODIFY = localStorage.getItem(IS_MANAGER) === "false";
	// CALL API GET ORDER & DEPOT DATA.
	const [depots, setDepots] = useState([]);
	const [orders, setOrders] = useState([]);
	const { setAlert } = useContext(ColorModeContext);
	useEffect(() => {
		AxiosInstance.get("api/web/get_order_dont_have_import/")
			.then((response) =>
				setOrders(
					response.data.map((e) => {
						return {
							name: `${e.id} - ${e.partner.name}`,
							...e,
						};
					})
				)
			)
			.catch((_) => setAlert(DATA_NOTICE));

		AxiosInstance.get("api/web/depot/")
			.then((response) =>
				setDepots(
					response.data.sort((a, b) => a.name.localeCompare(b.name))
				)
			)
			.catch((_) => setAlert(DATA_NOTICE));
	}, []);

	// CONTROL INITIAL VALUES.
	let convertedValues = {
		...initialValues,
		order: orders.filter((e) => e.id === selectedOrder)?.[0],
	};
	if (Boolean(form.id)) {
		convertedValues = { ...convertedValues, ...form };
		convertedValues.order.name = `${form.order.id} - ${form.order.partner.name}`;
	}

	return (
		<Formik
			initialValues={convertedValues}
			validationSchema={validationSchema}
			onSubmit={handleFormSubmit}
			enableReinitialize={true}
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
				<form onSubmit={handleSubmit} style={{ height: "100%" }}>
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<Box
							height="100%"
							display="flex"
							flexDirection="column"
							justifyContent="space-between"
						>
							<Box
								display="grid"
								gap="20px"
								gridTemplateColumns="repeat(4, minmax(0, 1fr))"
								sx={{
									"& .MuiFormHelperText-root": {
										fontStyle: "italic",
									},
								}}
							>
								<TextField
									name="created_date"
									label="CREATED_DATE"
									value={values.created_date}
									onBlur={handleBlur}
									onChange={handleChange}
									error={
										!!touched.created_date &&
										!!errors.created_date
									}
									helperText={
										touched.created_date &&
										errors.created_date
									}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									disabled
								/>
								<TextField
									name="total"
									label="TOTAL"
									type="number"
									value={total}
									sx={{ gridColumn: "span 2" }}
									fullWidth
									disabled
								/>
								<AutoCompleteField
									name="order"
									options={orders}
									value={values.order}
									onBlur={handleBlur}
									style={{ gridColumn: "span 4" }}
									error={!!touched.order && !!errors.order}
									helperText={touched.order && errors.order}
									setValue={(value) => {
										setSelectedOrder(value.id);
										values.order = value;
									}}
									freeSolo={false}
									onInputChange={null}
									groupBy={null}
									disabled={!CAN_MODIFY || Boolean(form.id)}
								/>
								{!CAN_MODIFY && (
									<AutoCompleteField
										name="depot"
										options={depots}
										value={values?.order?.depot}
										onBlur={handleBlur}
										style={{ gridColumn: "span 4" }}
										error={
											!!touched.depot && !!errors.depot
										}
										helperText={
											touched.depot && errors.depot
										}
										setValue={(value) =>
											(values.depot = value)
										}
										freeSolo={false}
										onInputChange={null}
										disabled={!CAN_MODIFY}
									/>
								)}
							</Box>

							<DialogActions
								sx={{
									p: "0",
									mt: "20px",
									justifyContent: "center",
									gap: "20px",
								}}
							>
								{CAN_MODIFY && (
									<Button
										label={form.id ? "MODIFY" : "CREATE"}
										variant="contained"
										type="submit"
										disabled={isSubmitting}
										style={{
											width: "25%",
											padding: "10px",
											color: "white",
										}}
									/>
								)}
								{form.id && (
									<Button
										label={"CANCEL"}
										variant="contained"
										onClick={handleFormCancel}
										style={{
											width: "25%",
											padding: "10px",
											color: "white",
										}}
									/>
								)}
							</DialogActions>
						</Box>
					</LocalizationProvider>
				</form>
			)}
		</Formik>
	);
}

export default DataForm;
