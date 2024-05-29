import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	ClickAwayListener,
	Grow,
	IconButton,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	useTheme,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ProfileModal from "../../components/ProfileModal";
import { AddressUtil } from "../../utils";
import { ColorModeContext, tokens } from "../../theme";
import ChangePasswordModal from "../../components/ChangePasswordModal";

const SettingMenu = ({ open, anchorRef, handleClose }) => {
	const navigate = useNavigate();
	const [openUpdateProfile, setOpenUpdateProfile] = useState(false);
	const [openChangePassword, setOpenChangePassword] = useState(false);

	const handleLogout = () => {
		// HANDLE LOGOUT LOGIC.
		navigate("/login");
	};

	const openDialog = (setOpen) => {
		handleClose();
		setOpen(true);
	};

	const closeUpdateProfile = () => {
		setOpenUpdateProfile(false);
	};

	const closeChangePassword = () => {
		setOpenChangePassword(false);
	};

	const handleUpdateProfile = (
		{ ward, district, province, ...contentValues },
		{ setSubmitting }
	) => {
		contentValues["address"] = AddressUtil.combine(
			ward,
			district,
			province
		);
		console.log(contentValues);
		// CALL API UPDATE PROFILE.
		setSubmitting(false);
		closeUpdateProfile();
	};

	const handleChangePassword = (values, { setSubmitting }) => {
		console.log(values);
		// CALL API CHANGE PASSWORD.
		setSubmitting(false);
		closeChangePassword();
	};

	return (
		<>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				placement="bottom-start"
				transition
				disablePortal
				sx={{ zIndex: 1 }}
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin:
								placement === "bottom-start"
									? "left top"
									: "left bottom",
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList
									autoFocusItem={open}
									id="composition-menu"
									aria-labelledby="composition-button"
								>
									<MenuItem
										sx={{
											paddingX: "25px",
											paddingY: "10px",
										}}
										onClick={() =>
											openDialog(setOpenUpdateProfile)
										}
									>
										PROFILE
									</MenuItem>
									<MenuItem
										sx={{
											paddingX: "25px",
											paddingY: "10px",
										}}
										onClick={() =>
											openDialog(setOpenChangePassword)
										}
									>
										CHANGE PASSWORD
									</MenuItem>
									<MenuItem
										sx={{
											paddingX: "25px",
											paddingY: "10px",
										}}
										onClick={handleLogout}
									>
										LOGOUT
									</MenuItem>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>

			<ProfileModal
				isOpened={openUpdateProfile}
				handleClose={closeUpdateProfile}
				handleFormSubmit={handleUpdateProfile}
				title="PERSONAL PROFILE"
				isPersonal={true}
				data={{}}
			/>

			<ChangePasswordModal
				isOpened={openChangePassword}
				handleClose={closeChangePassword}
				handleFormSubmit={handleChangePassword}
			/>
		</>
	);
};

export default function Topbar() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const colorMode = useContext(ColorModeContext);
	// CONTROL SETTING TOOLS.
	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Box height="10%" display="flex" justifyContent="flex-end" p={2}>
			<Box display="flex" gap={1}>
				{/* COLOR MODE */}
				<IconButton onClick={colorMode.toggleColorMode}>
					{theme.palette.mode === "dark" ? (
						<DarkModeOutlinedIcon />
					) : (
						<LightModeOutlinedIcon />
					)}
				</IconButton>
				{/* NOTIFICATION */}
				<IconButton>
					<NotificationsOutlinedIcon />
				</IconButton>
				{/* SETTINGS */}
				<IconButton ref={anchorRef} onClick={handleToggle}>
					<SettingsOutlinedIcon />
				</IconButton>
				<SettingMenu
					open={open}
					anchorRef={anchorRef}
					handleClose={handleClose}
				/>
			</Box>
		</Box>
	);
}
