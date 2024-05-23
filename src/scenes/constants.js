export const PHONE_REGEX =
	/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/gm;

export const GENDERS = [
	{ value: "", label: "NONE" },
	{ value: true, label: "MALE" },
	{ value: false, label: "FEMALE" },
];

export const ROLES = [
	{ value: true, label: "MANAGER" },
	{ value: false, label: "STAFF" },
];

export const URL_TO_TAB = {
	"/": "Dashboard",
	"/employee": "Employee",
	"/partner": "Business Partner",
	"/product": "Product",
	"/order": "Order",
	"/import": "Import",
	"/export": "Export",
};
