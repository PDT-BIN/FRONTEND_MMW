import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import Header from "../../components/Header";
import DataDialog from "./DataDialog";
import Button from "../../components/customs/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { ColorModeContext, tokens } from "../../theme";
import { mockDataPartner } from "../../data/mockData";
import { AddressUtil } from "../../utils";
import AxiosInstance from "../../api/api";
import {
	CREATE_PARTNER_FAILED,
	CREATE_PARTNER_SUCCESS,
	DATA_NOTICE,
	DELETE_PARTNER_FAILED,
	DELETE_PARTNER_SUCCESS,
	UPDATE_PARTNER_FAILED,
	UPDATE_PARTNER_SUCCESS,
} from "../../notice";

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

export default function Partner() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const selectedRow = useRef({});
	const [rows, setRows] = useState([]);
	const [selectedRowModel, setSelectedRowModel] = useState([]);
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
	const openForCreating = useMemo(
		() => Boolean(selectedRow.current.id),
		[selectedRow.current]
	);
	const [openModify, setOpenModify] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	// API.
	const { setAlert } = useContext(ColorModeContext);
	useEffect(() => {
		AxiosInstance.get("api/web/business_Partner/")
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
		contentValues["address"] = AddressUtil.combine(
			ward,
			district,
			province
		);

		if (!openForCreating) {
			AxiosInstance.post("api/web/business_Partner/", contentValues)
				.then((_) => {
					setAlert(CREATE_PARTNER_SUCCESS);
					closeModifyDialog();
				})
				.catch((_) => setAlert(CREATE_PARTNER_FAILED));
		} else {
			AxiosInstance.put(
				`api/web/business_Partner/${contentValues["id"]}/`,
				contentValues
			)
				.then((_) => {
					setAlert(UPDATE_PARTNER_SUCCESS);
					closeModifyDialog();
				})
				.catch((_) => setAlert(UPDATE_PARTNER_FAILED));
		}
		setSubmitting(false);
	};

	// CALL API DELETE.
	const handleDeleteSubmit = () => {
		AxiosInstance.delete(
			`api/web/business_Partner/${selectedRow.current["id"]}/`
		)
			.then((_) => {
				setAlert(DELETE_PARTNER_SUCCESS);
				closeDeleteDialog();
			})
			.catch((_) => setAlert(DELETE_PARTNER_FAILED));
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
							openForCreating,
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
				data={selectedRow.current}
			/>
			<ConfirmDialog
				isOpened={openDelete}
				handleClose={closeDeleteDialog}
				handleFormSubmit={handleDeleteSubmit}
				content={`ARE YOU SURE TO DELETE THE BUSINESS PARTER WITH ID #${selectedRow.current.id} ?`}
			/>
		</Box>
	);
}
