import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, Typography, useTheme, Divider } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkRemoveOutlinedIcon from "@mui/icons-material/BookmarkRemoveOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { tokens } from "../../theme";
import { URL_TO_TAB } from "../constants";

const Item = ({ title, to, icon, selected, setSelected }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<MenuItem
			active={selected === title}
			style={{ color: colors.grey[100] }}
			onClick={() => setSelected(title)}
			icon={icon}
		>
			<Typography variant="h5" fontStyle="italic">
				{title}
			</Typography>
			<Link to={to} />
		</MenuItem>
	);
};

const GroupDivider = ({ isCollapsed, title }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return !isCollapsed ? (
		<Typography
			variant="h6"
			color={colors.grey[300]}
			fontStyle="italic"
			sx={{ m: "10px 0 5px 20px" }}
		>
			{title}
		</Typography>
	) : (
		<Divider style={{ margin: "5px 0 0 0" }} />
	);
};

const GroupItem = ({ isCollapsed, title, children }) => {
	return (
		<Box>
			<GroupDivider isCollapsed={isCollapsed} title={title} />
			{children}
		</Box>
	);
};

export default function Sidebar() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const location = useLocation();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selected, setSelected] = useState(URL_TO_TAB[location.pathname]);

	return (
		<Box
			sx={{
				"& .pro-sidebar-inner": {
					background: `${colors.primary[400]} !important`,
				},
				"& .pro-icon-wrapper": {
					backgroundColor: "transparent !important",
				},
				"& .pro-inner-item": {
					padding: `5px 20px !important`,
				},
				"& .pro-inner-item:hover": {
					color: "#868dfb !important",
				},
				"& .pro-menu-item.active": {
					color: "#6870fa !important",
				},
				"& ::-webkit-scrollbar": {
					display: "none !important",
				},
			}}
		>
			<ProSidebar collapsed={isCollapsed}>
				<Menu iconShape="square">
					{/* MENU ICON */}
					<MenuItem
						onClick={() => setIsCollapsed(!isCollapsed)}
						icon={<MenuOutlinedIcon fontSize="large" />}
						style={{
							color: colors.grey[100],
							display: "flex",
							flexDirection: `${
								isCollapsed ? "row" : "row-reverse"
							}`,
						}}
					/>
					{/* USER PROFILE */}
					{!isCollapsed && (
						<Box my="20px">
							{/* AVATAR */}
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
							>
								<AdminPanelSettingsOutlinedIcon
									sx={{
										width: "128px",
										height: "128px",
										color: colors.greenAccent[400],
									}}
								/>
							</Box>
							{/* NAME & ROLE */}
							<Box textAlign="center">
								<Typography
									variant="h3"
									color={colors.grey[100]}
									fontWeight="bold"
									sx={{ m: "10px 0 0 0" }}
								>
									BIN BIN
								</Typography>
								<Typography
									variant="h5"
									color={colors.greenAccent[500]}
								>
									MANAGER
								</Typography>
							</Box>
						</Box>
					)}
					{/* MENU ITEMS */}
					<Item
						title="Dashboard"
						to="/"
						icon={<GridViewOutlinedIcon fontSize="large" />}
						selected={selected}
						setSelected={setSelected}
					/>
					<GroupItem isCollapsed={isCollapsed} title="Information">
						<Item
							title="Employee"
							to="/employee"
							icon={<Diversity2OutlinedIcon fontSize="large" />}
							selected={selected}
							setSelected={setSelected}
						/>
						<Item
							title="Business Partner"
							to="/partner"
							icon={<HandshakeOutlinedIcon fontSize="large" />}
							selected={selected}
							setSelected={setSelected}
						/>
						<Item
							title="Product"
							to="/product"
							icon={<CategoryOutlinedIcon fontSize="large" />}
							selected={selected}
							setSelected={setSelected}
						/>
					</GroupItem>
					<GroupItem isCollapsed={isCollapsed} title="Receipt">
						<Item
							title="Order"
							to="/order"
							icon={
								<BookmarkBorderOutlinedIcon fontSize="large" />
							}
							selected={selected}
							setSelected={setSelected}
						/>
						<Item
							title="Import"
							to="/import"
							icon={<BookmarkAddOutlinedIcon fontSize="large" />}
							selected={selected}
							setSelected={setSelected}
						/>
						<Item
							title="Export"
							to="/export"
							icon={
								<BookmarkRemoveOutlinedIcon fontSize="large" />
							}
							selected={selected}
							setSelected={setSelected}
						/>
					</GroupItem>
				</Menu>
			</ProSidebar>
		</Box>
	);
}
