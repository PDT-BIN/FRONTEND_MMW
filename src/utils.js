import moment from "moment";

export class DateTimeUtil {
	static FORMAT = "DD/MM/YYYY";

	static parse(value) {
		return moment(value, "DD/MM/YYYY", true).toDate();
	}

	static format(value) {
		const date = moment(value).format(DateTimeUtil.FORMAT);
		return date !== "Invalid date" ? date : "";
	}
}

export class AddressUtil {
	static hash(key, value) {
		return `${key.replace(".$", "")}~${value}`;
	}

	static getKey(value) {
		return value.split("~")[0];
	}

	static combine(...values) {
		return values.filter((e) => e !== "").join(", ");
	}

	static analyze(value) {
		const [province = "", district = "", ward = ""] = value
			.split(", ")
			.reverse();
		return { province, district, ward };
	}
}

export class FilterUtil {
	static distinct(array) {
		return Array.from(new Set(array.map((e) => JSON.stringify(e)))).map(
			(e) => JSON.parse(e)
		);
	}
}
