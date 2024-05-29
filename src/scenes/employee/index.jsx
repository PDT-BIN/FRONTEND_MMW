import { useMemo, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import Header from "../../components/Header";
import Button from "../../components/customs/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import ProfileModal from "../../components/ProfileModal";
import { tokens } from "../../theme";
import { AddressUtil, DateTimeUtil } from "../../utils";
import { mockDataEmployee } from "../../data/mockData";

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
				disabled={!props.openForCreating}
				startIcon={<EditIcon />}
				style={{ padding: "10px", color: colors.greenAccent[500] }}
			/>
			<Button
				label="DELETE RECORD"
				onClick={props.openDeleteDialog}
				disabled={!props.openForCreating}
				startIcon={<DeleteIcon />}
				style={{ padding: "10px", color: colors.greenAccent[500] }}
			/>
		</GridToolbarContainer>
	);
};

export default function Employee() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const selectedRow = useRef({});
	const [rows, setRows] = useState(mockDataEmployee);
	const [selectedRowModel, setSelectedRowModel] = useState([]);
	const columns = [
		{ field: "id", headerName: "ID", flex: 0.5, hideable: false },
		{
			field: "last_name",
			headerName: "LAST NAME",
			flex: 0.75,
			hideable: false,
		},
		{
			field: "first_name",
			headerName: "FIRST NAME",
			flex: 0.75,
			hideable: false,
		},
		{
			field: "birthdate",
			headerName: "BIRTHDATE",
			flex: 0.75,
			type: "date",
			valueGetter: (value) => DateTimeUtil.parse(value),
			valueFormatter: (value) => DateTimeUtil.format(value),
		},
		{ field: "email", headerName: "EMAIL", flex: 1, sortable: false },
		{
			field: "phone",
			headerName: "PHONE NUMBER",
			flex: 0.75,
			sortable: false,
		},
		{
			field: "is_superuser",
			headerName: "ROLE",
			flex: 1,
			display: "flex",
			renderCell: ({ row: { is_superuser, is_active } }) => {
				return (
					<Box
						width="65%"
						p="8px"
						borderRadius="4px"
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						backgroundColor={
							is_active
								? colors.greenAccent[600]
								: colors.redAccent[600]
						}
					>
						<Box
							width="30%"
							display="flex"
							justifyContent="center"
							alignItems="center"
						>
							{is_active ? (
								<SecurityOutlinedIcon />
							) : (
								<BlockOutlinedIcon />
							)}
						</Box>
						<Typography
							color={colors.grey[100]}
							fontStyle="italic"
							sx={{ width: "65%" }}
						>
							{is_superuser ? "Manager" : "Staff"}
						</Typography>
					</Box>
				);
			},
		},
	];
	// DIALOG SECTION.
	const openForCreating = useMemo(
		() => Boolean(selectedRow.current.id),
		[selectedRow.current]
	);
	const [openModify, setOpenModify] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const handleFormCancel = () => {
		setSelectedRowModel([]);
		selectedRow.current = {};
	};

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
		handleFormCancel();
	};

	const closeDeleteDialog = () => {
		setOpenDelete(false);
		handleFormCancel();
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
		if (!openForCreating) {
			// CALL API CREATE EMPLOYEE.
		} else {
			// CALL API UPDATE EMPLOYEE.
		}
		setSubmitting(false);
		closeModifyDialog();
	};

	const handleDeleteSubmit = () => {
		// CALL API DELETE EMPLOYEE.
		closeDeleteDialog();
	};

	return (
		<Box m="0 20px">
			<Header title="EMPLOYEE" subtitle="Manage members" />
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
							openForCreating,
						},
					}}
					rowSelectionModel={selectedRowModel}
					onRowSelectionModelChange={(params) => {
						if (selectedRowModel[0] === params[0]) {
							selectedRow.current = {};
							setSelectedRowModel([]);
						} else setSelectedRowModel(params);
					}}
					onRowClick={(params) => (selectedRow.current = params.row)}
					onRowDoubleClick={(params) => {
						selectedRow.current = params.row;
						openModifyDialog();
					}}
				/>
			</Box>

			<ProfileModal
				isOpened={openModify}
				handleClose={closeModifyDialog}
				handleFormSubmit={handleModifySubmit}
				title="EMPLOYEE PROFILE"
				data={selectedRow.current}
			/>
			<ConfirmDialog
				isOpened={openDelete}
				handleClose={closeDeleteDialog}
				handleFormSubmit={handleDeleteSubmit}
				content={`ARE YOU SURE TO DELETE THE EMPLOYEE WITH ID #${selectedRow.current.id} ?`}
			/>
		</Box>
	);
}
