import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import DataDialog from "./DataDialog";
import PriceDialog from "./PriceDialog";
import Header from "../../components/Header";
import Button from "../../components/customs/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { ColorModeContext, tokens } from "../../theme";
import { FilterUtil } from "../../utils";
import AxiosInstance from "../../api/api";
import {
	CREATE_PRODUCT_FAILED,
	CREATE_PRODUCT_SUCCESS,
	DATA_NOTICE,
	DELETE_PARTNER_SUCCESS,
	DELETE_PRODUCT_FAILED,
	UPDATE_PRODUCT_FAILED,
	UPDATE_PRODUCT_SUCCESS,
} from "../../notice";
import { IS_MANAGER } from "../../api/constants";

const Toolbar = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const role = localStorage.getItem(IS_MANAGER);

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
			{role === "true" && (
				<Button
					label="ESTABLISH PRICE"
					onClick={props.openPriceDialog}
					startIcon={<PriceChangeIcon />}
					style={{ padding: "10px", color: colors.greenAccent[500] }}
				/>
			)}
		</GridToolbarContainer>
	);
};

export default function Product() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// DATAGRID SECTION.
	const selectedRow = useRef({});
	const [rows, setRows] = useState([]);
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
		{
			field: "in_stock",
			headerName: "IN STOCK",
			type: "boolean",
			flex: 1,
		},
	];
	// DIALOG SECTION.
	const openForCreating = useMemo(
		() => Boolean(selectedRow.current.id),
		[selectedRow.current]
	);
	const [openModify, setOpenModify] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openPrice, setOpenPrice] = useState(false);
	// API.
	const { setAlert } = useContext(ColorModeContext);
	useEffect(() => {
		AxiosInstance.get("api/web/product/")
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
	const handleModifySubmit = (contentValues, { setSubmitting }) => {
		if (!openForCreating) {
			AxiosInstance.post("api/web/product/", contentValues)
				.then((_) => {
					setAlert(CREATE_PRODUCT_SUCCESS);
					closeModifyDialog();
				})
				.catch((_) => setAlert(CREATE_PRODUCT_FAILED));
		} else {
			AxiosInstance.put(
				`api/web/product/${contentValues["id"]}/`,
				contentValues
			)
				.then((_) => {
					setAlert(UPDATE_PRODUCT_SUCCESS);
					closeModifyDialog();
				})
				.catch((_) => setAlert(UPDATE_PRODUCT_FAILED));
		}
		setSubmitting(false);
	};

	// CALL API DELETE.
	const handleDeleteSubmit = () => {
		AxiosInstance.delete(`api/web/product/${selectedRow.current["id"]}/`)
			.then((_) => {
				setAlert(DELETE_PARTNER_SUCCESS);
				closeDeleteDialog();
			})
			.catch((_) => setAlert(DELETE_PRODUCT_FAILED));
	};

	const openPriceDialog = () => {
		setOpenPrice(true);
	};

	const closePriceDialog = () => {
		setOpenPrice(false);
		handleFormCancel();
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
							openPriceDialog,
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
				content={`ARE YOU SURE TO DELETE THE PRODUCT WITH ID #${selectedRow.current.id} ?`}
			/>
			<PriceDialog isOpened={openPrice} handleClose={closePriceDialog} />
		</Box>
	);
}
