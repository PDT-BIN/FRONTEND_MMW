import { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import TextField from "./TextField";
import { AddressUtil } from "../../utils";

const URL_PROVINCE = "https://vapi.vnappmob.com/api/province/";
const URL_DISTRICT = "https://vapi.vnappmob.com/api/province/district/";
const URL_WARD = "https://vapi.vnappmob.com/api/province/ward/";

export const ProvinceField = (props) => {
	const [PROVINCES, setProvinces] = useState([]);
	useEffect(() => {
		fetch(URL_PROVINCE)
			.then((respone) => respone.json())
			.then((data) =>
				data.results
					.map((province) => ({
						id: province.province_id,
						title: province.province_name,
					}))
					.sort((a, b) => a.title.localeCompare(b.title))
			)
			.then((results) => setProvinces(results))
			.catch((error) => console.error("ERROR FETCHING DATA:", error));
	}, []);

	return (
		<TextField {...props}>
			{PROVINCES.map((option) => (
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

export const DistrictField = ({ selectedProvince, ...props }) => {
	const [DISTRICTS, setDistricts] = useState([]);
	useEffect(() => {
		if (!Boolean(selectedProvince)) return;
		fetch(URL_DISTRICT + AddressUtil.getKey(selectedProvince))
			.then((respone) => respone.json())
			.then((data) =>
				data.results
					.map((district) => ({
						id: district.district_id,
						title: district.district_name,
					}))
					.sort((a, b) => a.title.localeCompare(b.title))
			)
			.then((results) => setDistricts(results))
			.catch((error) => console.error("ERROR FETCHING DATA:", error));
	}, [selectedProvince]);

	return (
		<TextField {...props} disabled={!Boolean(selectedProvince)}>
			{DISTRICTS.map((option) => (
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

export const WardField = ({ selectedDistrict, ...props }) => {
	const [WARDS, setWards] = useState([]);
	useEffect(() => {
		if (!Boolean(selectedDistrict)) return;
		fetch(URL_WARD + AddressUtil.getKey(selectedDistrict))
			.then((respone) => respone.json())
			.then((data) =>
				data.results
					.map((ward) => ({
						id: ward.ward_id,
						title: ward.ward_name,
					}))
					.sort((a, b) => a.title.localeCompare(b.title))
			)
			.then((results) => setWards(results))
			.catch((error) => console.error("ERROR FETCHING DATA:", error));
	}, [selectedDistrict]);

	return (
		<TextField {...props} disabled={!Boolean(selectedDistrict)}>
			{WARDS.map((option) => (
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
