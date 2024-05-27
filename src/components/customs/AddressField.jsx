import { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import TextField from "./TextField";
import { AddressUtil } from "../../utils";

const URL_PROVINCE = "https://vapi.vnappmob.com/api/province/";
const URL_DISTRICT = "https://vapi.vnappmob.com/api/province/district/";
const URL_WARD = "https://vapi.vnappmob.com/api/province/ward/";

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
				data.results
					.map((e) => ({ id: e.province_id, title: e.province_name }))
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
		fetch(URL_DISTRICT + AddressUtil.getKey(selectedProvince))
			.then((respone) => respone.json())
			.then((data) =>
				data.results
					.map((e) => ({ id: e.district_id, title: e.district_name }))
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
		fetch(URL_WARD + AddressUtil.getKey(selectedDistrict))
			.then((respone) => respone.json())
			.then((data) =>
				data.results
					.map((e) => ({ id: e.ward_id, title: e.ward_name }))
					.sort((a, b) => a.title.localeCompare(b.title))
			)
			.then((results) => setData(results))
			.catch((error) => console.error("ERROR FETCHING DATA:", error));
	}, [selectedDistrict]);

	return (
		<AddressField data={data} props={{ ...props, disabled: !isActived }} />
	);
};
