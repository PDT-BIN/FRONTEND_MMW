import { useState } from "react";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { DateTimeUtil } from "../../utils";
import { mockDataOrder } from "../../data/mockData";
import DataForm from "./DataForm";

// const Toolbar = (props) => {
// 	const theme = useTheme();
// 	const colors = tokens(theme.palette.mode);

// 	return (
// 		<GridToolbarContainer style={{ padding: "10px 0" }}>
// 			<Button
// 				label="ADD RECORD"
// 				onClick={props.openCreateDialog}
// 				startIcon={<AddIcon />}
// 				style={{ padding: "10px", color: colors.greenAccent[500] }}
// 			/>
// 			<Button
// 				label="EDIT RECORD"
// 				onClick={props.openModifyDialog}
// 				disabled={!Boolean(props.selectedRow.current.id)}
// 				startIcon={<EditIcon />}
// 				style={{ padding: "10px", color: colors.greenAccent[500] }}
// 			/>
// 			<Button
// 				label="DELETE RECORD"
// 				onClick={props.openDeleteDialog}
// 				disabled={!Boolean(props.selectedRow.current.id)}
// 				startIcon={<DeleteIcon />}
// 				style={{ padding: "10px", color: colors.greenAccent[500] }}
// 			/>
// 		</GridToolbarContainer>
// 	);
// };

const Order = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const [selectedRow, setSelectedRow] = useState({});
	const [rows, setRows] = useState(mockDataOrder);
	const columns = [
		{ field: "id", headerName: "ID", flex: 1, hideable: false },
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

	const handleFormSubmit = (contentValues, { setSubmitting }) => {
		console.log(contentValues);
		if (!Boolean(contentValues.id)) {
			// CALL API CREATE ORDER.
		} else {
			// CALL API UPDATE ORDER.
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
			gap="15px"
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
					onRowClick={(params) => {
						setSelectedRow(params.row);
					}}
				/>
			</Box>

			<Box
				mb="20px"
				flex="1"
				padding="20px"
				bgcolor={colors.primary[400]}
				borderRadius="5px"
				display="flex"
				justifyContent="space-between"
			>
				<Box width="40%">
					<DataForm
						handleFormSubmit={handleFormSubmit}
						data={selectedRow}
					/>
				</Box>

				<Box width="60%"></Box>
			</Box>
		</Box>
	);
};

export default Order;
