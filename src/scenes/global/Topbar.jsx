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
import AxiosInstance from "../../api/api";
import {
	CHANGE_PASSWORD_FAILED,
	CHANGE_PASSWORD_SUCCESS,
	DATA_NOTICE,
	LOGOUT_FAILED,
	LOGOUT_SUCCESS,
	UPDATE_PROFILE_FAILED,
	UPDATE_PROFILE_SUCCESS,
} from "../../notice";
import { PROFILE_ID } from "../../api/constants";

const SettingMenu = ({ open, anchorRef, handleClose }) => {
	const [openUpdateProfile, setOpenUpdateProfile] = useState(false);
	const [openChangePassword, setOpenChangePassword] = useState(false);
	// API.
	const navigate = useNavigate();
	const { setAlert } = useContext(ColorModeContext);
	const [profile, setProfile] = useState({});

	// CALL API LOGOUT.
	const handleLogout = async () => {
		try {
			const response = await AxiosInstance.post("logoutall/");
			if (response.status !== 204) return;

			setAlert(LOGOUT_SUCCESS);
			localStorage.clear();
			navigate("/login");
		} catch (error) {
			setAlert(LOGOUT_FAILED);
		}
	};

	const openDialog = (setOpen) => {
		if (setOpen === setOpenUpdateProfile) {
			const profileId = localStorage.getItem(PROFILE_ID);
			AxiosInstance.get(`api/web/profile/${profileId}`)
				.then((response) => setProfile(response.data))
				.catch((_) => setAlert(DATA_NOTICE));
		}

		handleClose();
		setOpen(true);
	};

	const closeUpdateProfile = () => {
		setProfile({});
		setOpenUpdateProfile(false);
	};

	const closeChangePassword = () => {
		setOpenChangePassword(false);
	};

	// CALL API UPDATE PROFILE.
	const handleUpdateProfile = (
		{ ward, district, province, ...contentValues },
		{ setSubmitting }
	) => {
		contentValues["address"] = AddressUtil.combine(
			ward,
			district,
			province
		);

		AxiosInstance.put(
			`api/web/profile/${localStorage.getItem(PROFILE_ID)}/`,
			contentValues
		)
			.then((_) => {
				setAlert(UPDATE_PROFILE_SUCCESS);
				closeUpdateProfile();
			})
			.catch((_) => setAlert(UPDATE_PROFILE_FAILED));
		setSubmitting(false);
	};

	// CALL API CHANGE PASSWORD.
	const handleChangePassword = (values, { setSubmitting }) => {
		AxiosInstance.put("api/web/change_password/", {
			old_password: values["current_password"],
			new_password: values["changed_password"],
		})
			.then((_) => {
				setAlert(CHANGE_PASSWORD_SUCCESS);
				closeChangePassword();
			})
			.catch((_) => setAlert(CHANGE_PASSWORD_FAILED));
		setSubmitting(false);
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
				data={profile}
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
