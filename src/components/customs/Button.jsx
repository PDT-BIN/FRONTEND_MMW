import { Button as MButton } from "@mui/material";

export default function Button({ label, style, ...rest }) {
	return (
		<MButton
			type="button"
			variant="text"
			disabled={false}
			sx={style}
			{...rest}
		>
			{label}
		</MButton>
	);
}