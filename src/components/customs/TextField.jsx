import { TextField as MTextFied } from "@mui/material";

export default function TextField({ style, ...rest }) {
	return <MTextFied variant="outlined" sx={style} {...rest} />;
}
