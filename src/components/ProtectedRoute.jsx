import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator.jsx";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../api/constants.js";
import AxiosInstance from "../api/api.js";

function ProtectedRoute() {
	// AUTHENTICATE USER.
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	useEffect(() => {
		authenticate().catch(() => setIsAuthenticated(false));
	}, []);

	const refreshToken = async () => {
		const token = localStorage.getItem(REFRESH_TOKEN);
		if (!token) {
			setIsAuthenticated(false);
			return;
		}
		// REFRESH TOKEN.
		const respone = await AxiosInstance.post("/api/token/refresh/", {
			refresh: token,
		});
		// CHECK RESPONE.
		if (respone.status !== 200) setIsAuthenticated(false);
		else {
			localStorage.setItem(ACCESS_TOKEN, respone.data.access);
			setIsAuthenticated(true);
		}
	};

	const authenticate = async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (!token) {
			setIsAuthenticated(false);
			return;
		}
		// CHECK TOKEN.
		const decoded = jwtDecode(token);
		if (decoded.exp < Date.now() / 1000) await refreshToken();
		else setIsAuthenticated(true);
	};

	switch (isAuthenticated) {
		case null:
			return <LoadingIndicator />;
		case true:
			return <Outlet />;
		default:
			return <Navigate to="/login" />;
	}
}

export default ProtectedRoute;
