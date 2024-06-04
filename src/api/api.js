import axios from "axios";
import { ACCESS_TOKEN, BASE_URL } from "./constants";

class APISingleton {
	static #instance;
	#axiosInstance;

	constructor() {
		if (APISingleton.#instance === undefined) {
			// CREATE AXIOS INSTANCE.
			this.#axiosInstance = axios.create({
				baseURL: BASE_URL,
				timeout: 5000,
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
				},
			});
			// REQUEST CONFIGURATION.
			this.#axiosInstance.interceptors.request.use(
				(config) => {
					const token = localStorage.getItem(ACCESS_TOKEN);
					if (token) config.headers.Authorization = `Token ${token}`;
					return config;
				},
				(error) => Promise.reject(error)
			);
			// RESPONSE CONFIGURATION.
			this.#axiosInstance.interceptors.response.use(
				(response) => {
					return response;
				},
				(error) => {
					if (error.response && error.response.status === 401) {
						localStorage.clear();
					}
					return Promise.reject(error);
				}
			);
			// STORE INSTANCE.
			APISingleton.#instance = this;
		}
		return APISingleton.#instance;
	}

	getAxiosInstance() {
		return this.#axiosInstance;
	}
}

const AxiosInstance = new APISingleton().getAxiosInstance();

export default AxiosInstance;
