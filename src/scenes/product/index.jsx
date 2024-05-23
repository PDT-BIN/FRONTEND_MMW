import { useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import DataDialog from "./DataDialog";
import Header from "../../components/Header";
import Button from "../../components/customs/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { tokens } from "../../theme";
import { FilterUtil } from "../../utils";
import { mockDataProduct } from "../../data/mockData";

const Toolbar = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<GridToolbarContainer style={{ padding: "10px 0" }}>
			<Button
				label="ADD RECORD"
				onClick={props.openCreateDialog}
				startIcon={<AddIcon />}
				style={{ padding: "10px", color: colors.greenAccent[500] }}
			/>
			<Button
				label="EDIT RECORD"
				onClick={props.openModifyDialog}
				disabled={!Boolean(props.selectedRow.current.id)}
				startIcon={<EditIcon />}
				style={{ padding: "10px", color: colors.greenAccent[500] }}
			/>
			<Button
				label="DELETE RECORD"
				onClick={props.openDeleteDialog}
				disabled={!Boolean(props.selectedRow.current.id)}
				startIcon={<DeleteIcon />}
				style={{ padding: "10px", color: colors.greenAccent[500] }}
			/>
		</GridToolbarContainer>
	);
};

const Product = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const selectedRow = useRef({});
	const [rows, setRows] = useState(mockDataProduct);
	const [selectedRowModel, setSelectedRowModel] = useState([]);
	const columns = [
		{ field: "id", headerName: "ID", flex: 1, hideable: false },
		{
			field: "name",
			headerName: "NAME",
			flex: 1,
			hideable: false,
		},
		{
			field: "category",
			headerName: "CATEGORY",
			flex: 1,
			valueGetter: (value) => value?.name || "",
		},
		{
			field: "inventory",
			headerName: "INVENTORY",
			type: "number",
			flex: 1,
			display: "flex",
			renderCell: ({ row: { inventory, unit } }) => {
				return (
					<Box display="flex" gap="5px">
						<Typography>{inventory}</Typography>
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
		},
	];
	// DIALOG SECTION.
	const [openModify, setOpenModify] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const openCreateDialog = () => {
		selectedRow.current = {};
		setOpenModify(true);
	};

	const openModifyDialog = () => {
		setOpenModify(true);
	};

	const openDeleteDialog = () => {
		setOpenDelete(true);
	};

	const closeModifyDialog = () => {
		setOpenModify(false);
	};

	const closeDeleteDialog = () => {
		setOpenDelete(false);
	};

	const handleModifySubmit = (contentValues, { setSubmitting }) => {
		console.log(contentValues);
		if (!Boolean(contentValues.id)) {
			// CALL API CREATE PRODUCT.
		} else {
			// CALL API UPDATE PRODUCT.
		}
		setSubmitting(false);
		closeModifyDialog();
	};

	const handleDeleteSubmit = () => {
		// CALL API DELETE PRODUCT.
		closeDeleteDialog();
	};

	return (
		<Box m="0 20px">
			<Header title="PRODUCT" subtitle="Manage products" />
			<Box
				mt="25px"
				width="100%"
				height="75vh"
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
					rowHeight={60}
					autoHeight
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 7,
							},
						},
					}}
					pageSizeOptions={[7]}
					disableColumnResize
					slots={{ toolbar: Toolbar }}
					slotProps={{
						toolbar: {
							openCreateDialog,
							openModifyDialog,
							openDeleteDialog,
							selectedRow,
						},
					}}
					rowSelectionModel={selectedRowModel}
					onRowClick={(params) => (selectedRow.current = params.row)}
					onRowSelectionModelChange={(params) => {
						if (selectedRowModel[0] === params[0]) {
							selectedRow.current = {};
							setSelectedRowModel([]);
						} else setSelectedRowModel(params);
					}}
					onRowDoubleClick={(params) => {
						selectedRow.current = params.row;
						openModifyDialog();
					}}
				/>
			</Box>

			<DataDialog
				isOpened={openModify}
				handleClose={closeModifyDialog}
				handleFormSubmit={handleModifySubmit}
				title={
					!Boolean(selectedRow.current.id)
						? "ADD NEW PRODUCT"
						: `EDIT PRODUCT #${selectedRow.current.id}`
				}
				data={{
					categories: FilterUtil.distinct(
						rows
							.map((e) => e.category)
							.filter((e) => e !== null)
							.sort((a, b) => a.name.localeCompare(b.name))
					),
					units: FilterUtil.distinct(rows.map((e) => e.unit).sort()),
					selectedRow: selectedRow.current,
				}}
			/>
			<ConfirmDialog
				isOpened={openDelete}
				handleClose={closeDeleteDialog}
				handleFormSubmit={handleDeleteSubmit}
				title="DELETE A RECORD"
				content={`ARE YOU SURE TO DELETE THE PRODUCT WITH ID #${selectedRow.current.id} ?`}
			/>
		</Box>
	);
};

export default Product;
