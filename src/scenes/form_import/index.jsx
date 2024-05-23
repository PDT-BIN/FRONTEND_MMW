import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { DateTimeUtil } from "../../utils";
import { mockDataImport, mockDataImportDetail } from "../../data/mockData";
import DataForm from "./DataForm";
import DataDetail from "./DataDetail";

const Import = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const [selectedRowModel, setSelectedRowModel] = useState([]);
	const [rows, setRows] = useState(mockDataImport);
	const columns = [
		{ field: "id", headerName: "ID", flex: 1, hideable: false },
		{
			field: "order",
			headerName: "ORDER",
			flex: 1,
			hideable: false,
			valueGetter: (value) => `${value.id} - ${value.partner.name}`,
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
	];
	// FORM SECTION.
	const [selectedRow, setSelectedRow] = useState({});
	// DETAIL SECTION.
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [details, setDetails] = useState([]);
	useEffect(() => {
		if (!Boolean(selectedRow.id)) {
			setSelectedOrder(null);
			setDetails([]);
			return;
		}
		setSelectedOrder(selectedRow.order?.id);
		// CALL API TO GET FORM DETAIL.
		setDetails(
			mockDataImportDetail.filter((e) => e.import_id === selectedRow.id)
		);
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

	const handleFormSubmit = (contentValues, { setSubmitting }) => {
		contentValues = {
			...contentValues,
			total: total,
			details: details.map((e) => {
				return {
					id: `${selectedOrder}-${e.product.id}`,
					...e,
				};
			}),
		};
		console.log(contentValues);
		if (!Boolean(contentValues.id)) {
			// CALL API CREATE IMPORT FORM.
		} else {
			// CALL API UPDATE IMPORT FORM.
		}
		setSubmitting(false);
		handleFormCancel();
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
				height="262px"
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
					"& .MuiDataGrid-selectedRowCount": {
						visibility: "hidden !important",
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
						selectedOrder={selectedOrder}
						setSelectedOrder={setSelectedOrder}
					/>
				</Box>

				<Box width="52%">
					<DataDetail
						orderId={selectedRow.order_id}
						details={details}
						setDetails={setDetails}
						selectedOrder={selectedOrder}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default Import;
