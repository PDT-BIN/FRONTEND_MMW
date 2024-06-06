import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { ColorModeContext, tokens } from "../../theme";
import { AddressUtil, DateTimeUtil } from "../../utils";
import AxiosInstance from "../../api/api";
import {
	CREATE_EMPLOYEE_FAILED,
	CREATE_EMPLOYEE_SUCCESS,
	DATA_NOTICE,
	DELETE_EMPLOYEE_FAILED,
	DELETE_EMPLOYEE_SUCCESS,
	UPDATE_EMPLOYEE_FAILED,
	UPDATE_EMPLOYEE_SUCCESS,
} from "../../notice";
import { USER_ID } from "../../api/constants";

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
				disabled={!props.openForCreating || !props.canModify}
				startIcon={<EditIcon />}
				style={{ padding: "10px", color: colors.greenAccent[500] }}
			/>
			<Button
				label="DELETE RECORD"
				onClick={props.openDeleteDialog}
				disabled={!props.openForCreating || !props.canModify}
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
	const [rows, setRows] = useState([]);
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
	const canModify = useMemo(
		() => selectedRow.current.id !== Number(localStorage.getItem(USER_ID)),
		[selectedRow.current]
	);
	const [openModify, setOpenModify] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	// API.
	const { setAlert } = useContext(ColorModeContext);
	useEffect(() => {
		AxiosInstance.get("api/web/profile/")
			.then((response) => setRows(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	}, [openModify, openDelete]);

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

	// CALL API CREATE & UPDATE.
	const handleModifySubmit = (
		{ ward, district, province, ...contentValues },
		{ setSubmitting }
	) => {
		contentValues["birthdate"] = DateTimeUtil.format(
			contentValues["birthdate"]
		);
		contentValues["address"] = AddressUtil.combine(
			ward,
			district,
			province
		);

		if (!openForCreating) {
			AxiosInstance.post("api/web/profile/", contentValues)
				.then((_) => {
					setAlert(CREATE_EMPLOYEE_SUCCESS);
					closeModifyDialog();
				})
				.catch((_) => setAlert(CREATE_EMPLOYEE_FAILED));
		} else {
			AxiosInstance.put(
				`api/web/profile/${contentValues["id"]}/`,
				contentValues
			)
				.then((_) => {
					setAlert(UPDATE_EMPLOYEE_SUCCESS);
					closeModifyDialog();
				})
				.catch((_) => setAlert(UPDATE_EMPLOYEE_FAILED));
		}
		setSubmitting(false);
	};

	// CALL API DELETE.
	const handleDeleteSubmit = () => {
		AxiosInstance.delete(`api/web/profile/${selectedRow.current["id"]}/`)
			.then((_) => {
				setAlert(DELETE_EMPLOYEE_SUCCESS);
				closeDeleteDialog();
			})
			.catch((_) => setAlert(DELETE_EMPLOYEE_FAILED));
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
							canModify,
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
