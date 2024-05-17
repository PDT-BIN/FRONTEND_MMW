import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import TextField from "./TextField";

const PasswordField = (props) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<TextField
			name={props.name}
			label={props.label}
			color={props.color}
			style={props.style}
			type={showPassword ? "text" : "password"}
			value={props.value}
			onBlur={props.handleBlur}
			onChange={props.handleChange}
			error={props.error}
			helperText={props.helperText}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							onClick={() => setShowPassword(!showPassword)}
							edge="end"
						>
							{showPassword ? (
								<RemoveRedEyeOutlinedIcon />
							) : (
								<VisibilityOffOutlinedIcon />
							)}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
};

export default PasswordField;
