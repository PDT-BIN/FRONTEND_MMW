import { useState } from "react";
import { Link } from "react-router-dom";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import { tokens } from "../../theme";
import react from "../../assets/react.svg";

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
			<Typography variant="h5">{title.toUpperCase()}</Typography>
			<Link to={to} />
		</MenuItem>
	);
};

const Sidebar = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selected, setSelected] = useState("Dashboard");

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
					padding: `0 20px !important`,
				},
				"& .pro-inner-item:hover": {
					color: "#868dfb !important",
				},
				"& .pro-menu-item.active": {
					color: "#6870fa !important",
				},
			}}
		>
			<ProSidebar collapsed={isCollapsed}>
				<Menu iconShape="square">
					{/* MENU ICON */}
					<MenuItem
						onClick={() => setIsCollapsed(!isCollapsed)}
						icon={<MenuOutlinedIcon />}
						style={{
							marginTop: "10px",
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
								<img
									alt="profile-user"
									width="100px"
									height="100px"
									src={react}
									style={{
										cursor: "pointer",
										borderRadius: "50%",
									}}
								/>
							</Box>
							{/* NAME & TITLE */}
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
					<Box>
						<Item
							title="Dashboard"
							to="/"
							icon={<GridViewOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
						/>
					</Box>
				</Menu>
			</ProSidebar>
		</Box>
	);
};

export default Sidebar;
