import { useContext, useEffect, useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import { DateTimeUtil } from "../../utils";
import DataForm from "./DataForm";
import DataDetail from "./DataDetail";
import AxiosInstance from "../../api/api";
import {
	CREATE_FORM_FAILED,
	CREATE_FORM_SUCCESS,
	DATA_NOTICE,
	EMPTY_FORM_WARNING,
	UPDATE_FORM_FAILED,
	UPDATE_FORM_SUCCESS,
} from "../../notice";
import { USER_ID } from "../../api/constants";

const Order = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const [selectedRowModel, setSelectedRowModel] = useState([]);
	const [rows, setRows] = useState([]);
	const columns = [
		{ field: "id", headerName: "ID", flex: 0.5, hideable: false },
		{
			field: "partner",
			headerName: "PARTNER",
			flex: 1,
			hideable: false,
			valueGetter: (value) => value.name,
		},
		{
			field: "depot",
			headerName: "DEPOT",
			flex: 1,
			hideable: false,
			valueGetter: (value) => value.name,
		},
		{
			field: "user",
			headerName: "CREATOR",
			flex: 1,
			valueGetter: (_, row) =>
				`${row.user.profile.id} - ${row.user.profile.last_name} ${row.user.profile.first_name}`,
		},
		{
			field: "created_date",
			headerName: "CREATED AT",
			type: "date",
			flex: 1,
			valueGetter: (value) => DateTimeUtil.parse(value),
			valueFormatter: (value) => DateTimeUtil.format(value),
		},
		{
			field: "total",
			headerName: "TOTAL (VNĐ)",
			type: "number",
			flex: 1,
		},
		{
			field: "imported",
			headerName: "IMPORTED",
			type: "boolean",
			flex: 1,
		},
	];
	// API.
	const { setAlert } = useContext(ColorModeContext);
	const fetchData = () => {
		AxiosInstance.get("api/web/order_form/")
			.then((response) => setRows(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	};
	useEffect(() => fetchData(), []);
	// FORM SECTION.
	const [selectedRow, setSelectedRow] = useState({});
	const canModify = useMemo(
		() =>
			!Boolean(selectedRow.id) ||
			(Number(localStorage.getItem(USER_ID)) === selectedRow?.user?.id &&
				!selectedRow?.imported),
		[selectedRow]
	);
	// DETAIL SECTION.
	const [details, setDetails] = useState([]);
	useEffect(() => {
		if (!Boolean(selectedRow.id)) {
			setDetails([]);
			return;
		}
		// CALL API TO GET FORM DETAIL.
		AxiosInstance.get(
			`api/web/order_detail/${selectedRow.id}/filter_detail/`
		)
			.then((response) => setDetails(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	}, [selectedRow]);
	// CALCULATE TOTAL AUTOMATICALLY.
	const total = useMemo(
		() =>
			details.map((e) => e.quantity * e.price).reduce((a, b) => a + b, 0),
		[details]
	);

	const handleFormCancel = () => {
		setSelectedRowModel([]);
		setSelectedRow({});
	};

	// CALL API CREATE & UPDATE.
	const handleFormSubmit = (contentValues, { setSubmitting, resetForm }) => {
		if (details.length === 0) {
			setAlert(EMPTY_FORM_WARNING);
			setSubmitting(false);
			return;
		}

		contentValues = {
			...contentValues,
			total: total,
			details: !Boolean(selectedRow.id)
				? details
				: details.map((e) => {
						return {
							id: `${selectedRow.id}-${e.product.id}`,
							...e,
						};
				  }),
		};

		if (!Boolean(contentValues.id)) {
			AxiosInstance.post("api/web/order_form/", contentValues)
				.then((_) => {
					setAlert(CREATE_FORM_SUCCESS);
					handleFormCancel();
					resetForm();
					fetchData();
				})
				.catch((_) => setAlert(CREATE_FORM_FAILED));
		} else {
			AxiosInstance.put(
				`api/web/order_form/${selectedRow.id}/`,
				contentValues
			)
				.then((_) => {
					setAlert(UPDATE_FORM_SUCCESS);
					handleFormCancel();
					resetForm();
					fetchData();
				})
				.catch((_) => setAlert(UPDATE_FORM_FAILED));
		}
		setSubmitting(false);
	};

	return (
		<Box
			m="0 20px"
			height="100%"
			maxHeight="90vh"
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			gap="20px"
		>
			<Box
				width="100%"
				minHeight="262px"
				sx={{
					"& .MuiDataGrid-root": {
						border: "none !important",
					},
					"& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus, & .MuiDataGrid-withBorderColor":
						{
							outline: "none !important",
						},
					"& .MuiDataGrid-columnHeader": {
						backgroundColor: colors.blueAccent[700],
					},
					"& .MuiDataGrid-topContainer::after": {
						content: "none",
					},
					"& .MuiDataGrid-virtualScroller": {
						backgroundColor: colors.primary[400],
					},
					"& .MuiDataGrid-cell": {
						border: "none !important",
					},
					"& .css-tgsonj": {
						border: "none !important",
					},
					"& .MuiDataGrid-footerContainer": {
						minHeight: "50px !important",
						height: "50px !important",
						backgroundColor: colors.blueAccent[700],
						border: "none !important",
						borderRadius: "0 0 4px 4px",
					},
					"& .MuiDataGrid-columnSeparator": {
						display: "none !important",
					},
				}}
			>
				<DataGrid
					columns={columns}
					rows={rows}
					autoPageSize
					disableColumnResize
					rowSelectionModel={selectedRowModel}
					onRowClick={(params) => setSelectedRow(params.row)}
					onRowSelectionModelChange={(params) => {
						if (selectedRowModel[0] === params[0])
							handleFormCancel();
						else setSelectedRowModel(params);
					}}
				/>
			</Box>

			<Box
				mb="20px"
				maxHeight="342px"
				flex="1"
				display="flex"
				justifyContent="space-between"
			>
				<Box
					width="45%"
					padding="25px"
					borderRadius="5px"
					bgcolor={colors.primary[400]}
				>
					<DataForm
						handleFormSubmit={handleFormSubmit}
						handleFormCancel={handleFormCancel}
						form={selectedRow}
						total={total}
						canModify={canModify}
					/>
				</Box>

				<Box width="52%">
					<DataDetail
						details={details}
						setDetails={setDetails}
						canModify={canModify}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default Order;
