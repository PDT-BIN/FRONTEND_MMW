import axios from "axios";
import { ACCESS_TOKEN, BASE_URL, REFRESH_TOKEN } from "./constants";

const AxiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
		accept: "application/json",
	},
});

AxiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
		}
		return Promise.reject(error);
	}
);

export default AxiosInstance;
