import { Autocomplete } from "@mui/material";
import TextField from "./TextField";

export default function AutoCompleteField({
	name,
	options,
	value,
	onBlur,
	style,
	error,
	helperText,
	setValue,
	...props
}) {
	return (
		<Autocomplete
			freeSolo
			name={`${name}-field`}
			options={options}
			groupBy={(option) => option.name[0]}
			getOptionLabel={(option) => option.name || option}
			isOptionEqualToValue={(option, value) => value.id === option.id}
			value={value || null}
			onBlur={onBlur}
			onChange={(_, newValue) => {
				setValue(newValue);
				if (value === null) value = "";
			}}
			onInputChange={(event) => {
				if (event === null) return;
				setValue(event.target.value);
			}}
			sx={style}
			renderOption={({ key, ...props }, option) => (
				<li
					key={key}
					{...props}
					style={{
						padding: "15px",
						fontStyle: "italic",
					}}
				>
					{option.name}
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					name={name}
					label={name.toUpperCase()}
					error={error}
					helperText={helperText}
				/>
			)}
			{...props}
		/>
	);
}
