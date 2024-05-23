import { useState } from "react";
import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Box, Typography } from "@mui/material";
import Button from "../../components/customs/Button";
import { tokens } from "../../theme";
import DetailDialog from "./DetailDialog";

const Toolbar = ({ openDialog, openForCreating, selectedOrder }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<GridToolbarContainer style={{ padding: "10px 0" }}>
			<Button
				label={openForCreating ? "CREATE" : "MODIFY"}
				onClick={openDialog}
				startIcon={<AddIcon />}
				disabled={!Boolean(selectedOrder)}
				style={{ padding: "10px", color: colors.greenAccent[500] }}
			/>
		</GridToolbarContainer>
	);
};

function DataDetail({ details, setDetails, selectedOrder }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const columns = [
		{ field: "id", headerName: "ID", flex: 1 },
		{
			field: "product",
			headerName: "PRODUCT",
			flex: 1,
			hideable: false,
			valueGetter: (value) => value.name,
		},
		{
			field: "quantity",
			headerName: "QUANTITY",
			type: "number",
			flex: 1,
			hideable: false,
			display: "flex",
			renderCell: ({
				row: {
					quantity,
					product: { unit },
				},
			}) => {
				return (
					<Box display="flex" gap="5px">
						<Typography>{quantity}</Typography>
						<Typography fontStyle="italic">({unit})</Typography>
					</Box>
				);
			},
		},
		{
			field: "price",
			headerName: "PRICE (VNĐ)",
			type: "number",
			flex: 1,
			hideable: false,
		},
	];
	const [openedDialog, setOpenedDialog] = useState(false);

	const openDialog = () => {
		setOpenedDialog(true);
	};

	const closeDialog = () => {
		setOpenedDialog(false);
	};

	const handleFormSubmit = (modifiedData) => {
		setDetails(modifiedData);
		closeDialog();
	};

	return (
		<Box
			width="100%"
			height="100%"
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
				"& .MuiDataGrid-row--editing div": {
					backgroundColor: `${colors.primary[500]} !important`,
				},
			}}
		>
			<DataGrid
				columns={columns}
				rows={details}
				getRowId={(row) => `${row.order_id}-${row.product.id}`}
				autoPageSize
				disableColumnResize
				columnVisibilityModel={{ id: false }}
				editMode="row"
				onProcessRowUpdateError={(error) => console.log(error)}
				slots={{ toolbar: Toolbar }}
				slotProps={{
					toolbar: {
						openDialog: openDialog,
						openForCreating: Object.keys(details).length === 0,
						selectedOrder: selectedOrder,
					},
				}}
			/>

			<DetailDialog
				isOpened={openedDialog}
				handleClose={closeDialog}
				handleFormSubmit={handleFormSubmit}
				details={details}
				selectedOrder={selectedOrder}
			/>
		</Box>
	);
}

export default DataDetail;
