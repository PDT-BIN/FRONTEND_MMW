import { useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { mockDataPartner } from "../../data/mockData";
import Button from "../../components/customs/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import DataDialog from "./DataDialog";

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

const Partner = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const selectedRow = useRef({});
	const [rows, setRows] = useState(mockDataPartner);
	const columns = [
		{ field: "id", headerName: "ID", flex: 0.5, hideable: false },
		{
			field: "name",
			headerName: "FULL NAME",
			flex: 1,
			hideable: false,
		},
		{
			field: "gender",
			headerName: "GENDER",
			flex: 0.5,
			display: "flex",
			renderCell: ({ value }) =>
				value ? (
					<MaleIcon fontSize="large" />
				) : (
					<FemaleIcon fontSize="large" />
				),
		},
		{ field: "email", headerName: "EMAIL", flex: 1, sortable: false },
		{
			field: "address",
			headerName: "ADDRESS",
			flex: 1.25,
			sortable: false,
			valueGetter: (value) => value.replace(/(\d+~)/g, ""),
		},
		{
			field: "company",
			headerName: "COMPANY",
			flex: 0.75,
			valueGetter: (value) => (Boolean(value) ? value : "Khách hàng"),
		},
		{
			field: "taxcode",
			headerName: "TAXCODE",
			type: "boolean",
			flex: 0.75,
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

	const cancelSelect = () => {
		selectedRow.current = {};
		document
			.querySelector(".Mui-selected")
			?.classList.remove("Mui-selected");
	};

	const closeModifyDialog = () => {
		cancelSelect();
		setOpenModify(false);
	};

	const closeDeleteDialog = () => {
		cancelSelect();
		setOpenDelete(false);
	};

	const handleModifySubmit = (
		{ ward, district, province, ...contentValues },
		{ setSubmitting }
	) => {
		contentValues["address"] = AddressUtil.combine(
			ward,
			district,
			province
		);
		console.log(contentValues);
		if (!Boolean(contentValues.id)) {
			// CALL API CREATE BUSINESS PARTNER.
		} else {
			// CALL API UPDATE BUSINESS PARTNER.
		}
		setSubmitting(false);
		closeModifyDialog();
	};

	const handleDeleteSubmit = () => {
		// CALL API DELETE PARTNER.
		closeDeleteDialog();
	};

	return (
		<Box m="0 20px">
			<Header title="BUSINESS PARTNER" subtitle="Manage partners" />
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
					onRowClick={(params) => {
						selectedRow.current = params.row;
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
						? "ADD NEW BUSINESS PARTNER"
						: `EDIT BUSINESS PARTNER #${selectedRow.current.id}`
				}
				data={selectedRow.current}
			/>
			<ConfirmDialog
				isOpened={openDelete}
				handleClose={closeDeleteDialog}
				handleFormSubmit={handleDeleteSubmit}
				title="DELETE A RECORD"
				content={`ARE YOU SURE TO DELETE THE BUSINESS PARTER WITH ID #${selectedRow.current.id} ?`}
			/>
		</Box>
	);
};

export default Partner;
