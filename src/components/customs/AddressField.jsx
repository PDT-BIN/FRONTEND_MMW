import { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import TextField from "./TextField";
import { AddressUtil } from "../../utils";

const URL_PROVINCE = "https://esgoo.net/api-tinhthanh/1/0.htm";
const URL_DISTRICT = "https://esgoo.net/api-tinhthanh/2/";
const URL_WARD = "https://esgoo.net/api-tinhthanh/3/";

const AddressField = ({ data, props }) => {
	return (
		<TextField {...props}>
			{data.map((option) => (
				<MenuItem
					key={option.id}
					value={AddressUtil.hash(option.id, option.title)}
					sx={{ padding: "10px", fontStyle: "italic" }}
				>
					{option.title}
				</MenuItem>
			))}
		</TextField>
	);
};

export const ProvinceField = (props) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		fetch(URL_PROVINCE)
			.then((respone) => respone.json())
			.then((data) =>
				data.data
					.map((e) => ({ id: e.id, title: e.full_name }))
					.sort((a, b) => a.title.localeCompare(b.title))
			)
			.then((results) => setData(results))
			.catch((error) => console.error("ERROR FETCHING DATA:", error));
	}, []);

	return <AddressField data={data} props={props} />;
};

export const DistrictField = ({ selectedProvince, ...props }) => {
	const [data, setData] = useState([]);
	const isActived = Boolean(selectedProvince);

	useEffect(() => {
		if (!isActived) return;
		fetch(URL_DISTRICT + AddressUtil.getKey(selectedProvince) + ".htm")
			.then((respone) => respone.json())
			.then((data) =>
				data.data
					.map((e) => ({ id: e.id, title: e.full_name }))
					.sort((a, b) => a.title.localeCompare(b.title))
			)
			.then((results) => setData(results))
			.catch((error) => console.error("ERROR FETCHING DATA:", error));
	}, [selectedProvince]);

	return (
		<AddressField data={data} props={{ ...props, disabled: !isActived }} />
	);
};

export const WardField = ({ selectedDistrict, ...props }) => {
	const [data, setData] = useState([]);
	const isActived = Boolean(selectedDistrict);

	useEffect(() => {
		if (!isActived) return;
		fetch(URL_WARD + AddressUtil.getKey(selectedDistrict) + ".htm")
			.then((respone) => respone.json())
			.then((data) =>
				data.data
					.map((e) => ({ id: e.id, title: e.full_name }))
					.sort((a, b) => a.title.localeCompare(b.title))
			)
			.then((results) => setData(results))
			.catch((error) => console.error("ERROR FETCHING DATA:", error));
	}, [selectedDistrict]);

	return (
		<AddressField data={data} props={{ ...props, disabled: !isActived }} />
	);
};
