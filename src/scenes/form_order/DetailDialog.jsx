import { useEffect, useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box, DialogActions } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "../../components/customs/Dialog";
import Button from "../../components/customs/Button";
import { tokens } from "../../theme";
import { mockDataProduct } from "../../data/mockData";
import TextField from "../../components/customs/TextField";

function CustomList({ data, checked, handleToggle }) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			width="25%"
			minHeight="359.55px"
			maxHeight="359.55px"
			bgcolor={colors.primary[700]}
			borderRadius="5px"
			overflow="auto"
		>
			<List component="div" role="list">
				{data.map((e) => {
					return (
						<ListItemButton
							key={e.id}
							onClick={handleToggle(e)}
							sx={{ height: "68.71px" }}
						>
							<ListItemIcon>
								<Checkbox
									checked={checked.indexOf(e) !== -1}
									tabIndex={-1}
									disableRipple
									color="success"
								/>
							</ListItemIcon>
							<ListItemText sx={{ fontStyle: "italic" }}>
								{e.name}
							</ListItemText>
						</ListItemButton>
					);
				})}
			</List>
		</Box>
	);
}

function TransferList({
	modifiedProducts,
	allProducts,
	currentProducts,
	currentDetails,
}) {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [checked, setChecked] = useState([]);
	const [left, setLeft] = useState([...allProducts]);
	const [right, setRight] = useState([...currentProducts]);
	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);
	modifiedProducts.current = right;

	function not(a, b) {
		return a.filter((value) => b.indexOf(value) === -1);
	}

	function intersection(a, b) {
		return a.filter((value) => b.indexOf(value) !== -1);
	}

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const handleAllRight = () => {
		setRight(right.concat(left));
		setLeft([]);
	};

	const handleAllLeft = () => {
		setLeft(left.concat(right));
		setRight([]);
	};

	const handleCheckedRight = () => {
		setRight(right.concat(leftChecked));
		setLeft(not(left, leftChecked));
		setChecked(not(checked, leftChecked));
	};

	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked));
		setRight(not(right, rightChecked));
		setChecked(not(checked, rightChecked));
	};

	return (
		<Box display="flex" justifyContent="space-between">
			<CustomList
				data={left}
				checked={checked}
				handleToggle={handleToggle}
			/>
			<Box
				width="10%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				gap="10px"
			>
				<Button
					variant="contained"
					size="large"
					onClick={handleAllRight}
					disabled={left.length === 0}
					aria-label="move all right"
					label=">>"
				/>
				<Button
					variant="contained"
					size="large"
					onClick={handleCheckedRight}
					disabled={leftChecked.length === 0}
					aria-label="move selected right"
					label="&gt;"
				/>
				<Button
					variant="contained"
					size="large"
					onClick={handleCheckedLeft}
					disabled={rightChecked.length === 0}
					aria-label="move selected left"
					label="&lt;"
				/>
				<Button
					variant="contained"
					size="large"
					onClick={handleAllLeft}
					disabled={right.length === 0}
					aria-label="move all left"
					label="<<"
				/>
			</Box>
			<CustomList
				data={right}
				checked={checked}
				handleToggle={handleToggle}
			/>

			<Box
				paddingY="8px"
				width="35%"
				maxHeight="359.55px"
				bgcolor={colors.primary[700]}
				borderRadius="5px"
				overflow="auto"
				display="flex"
				flexDirection="column"
			>
				{right.map((e) => {
					return (
						<Box
							paddingX="16px"
							paddingY="8px"
							key={e.id}
							display="flex"
							justifyContent="space-between"
						>
							<TextField
								name={`quantity-${e.id}`}
								label="QUANTITY"
								type="number"
								color="secondary"
								style={{ width: "47%" }}
								defaultValue={
									currentDetails.filter(
										(detail) => detail.id === e.id
									)?.[0]?.quantity || 0
								}
							/>
							<TextField
								name={`price-${e.id}`}
								label="PRICE"
								type="number"
								color="secondary"
								style={{ width: "47%" }}
								defaultValue={
									currentDetails.filter(
										(detail) => detail.id === e.id
									)?.[0]?.price || 0
								}
							/>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}

function DetailDialog({ isOpened, handleClose, handleFormSubmit, details }) {
	const modifiedProducts = useRef([]);
	const [allProducts, setAllProducts] = useState([]);
	useEffect(() => {
		// CALL API GET PRODUCT DATA.
		setAllProducts(mockDataProduct);
	}, []);

	const handleSubmit = () => {
		handleFormSubmit(
			modifiedProducts.current.map((e) => {
				const quantityField = document.querySelector(
					`input[name='quantity-${e.id}']`
				);
				const priceField = document.querySelector(
					`input[name='price-${e.id}']`
				);
				return {
					product: e,
					quantity: Number(quantityField.value),
					price: Number(priceField.value),
				};
			})
		);
	};

	return (
		<Dialog
			isOpened={isOpened}
			handleClose={handleClose}
			title={Object.keys(details).length === 0 ? "CREATE" : "MODIFY"}
			style={{ width: "90%" }}
		>
			<TransferList
				modifiedProducts={modifiedProducts}
				allProducts={allProducts
					.filter(
						(e) =>
							details.filter(
								(detail) => detail.product.id === e.id
							).length === 0
					)
					.map((e) => {
						return { id: e.id, name: e.name, unit: e.unit };
					})}
				currentProducts={details.map((e) => {
					return {
						id: e.product.id,
						name: e.product.name,
						unit: e.product.unit,
					};
				})}
				currentDetails={details.map((e) => {
					return {
						id: e.product.id,
						quantity: e.quantity,
						price: e.price,
					};
				})}
			/>

			<DialogActions sx={{ mt: "25px", gap: "10px" }}>
				<Button
					label="SUBMIT"
					variant="contained"
					onClick={handleSubmit}
					style={{
						width: "15%",
						padding: "10px",
						color: "white",
					}}
				/>
				<Button
					label="CANCEL"
					variant="contained"
					onClick={handleClose}
					style={{
						width: "15%",
						padding: "10px",
						color: "white",
					}}
				/>
			</DialogActions>
		</Dialog>
	);
}

export default DetailDialog;
