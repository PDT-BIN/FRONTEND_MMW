import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator.jsx";
import { ACCESS_TOKEN } from "../api/constants.js";

function ProtectedRoute() {
	// AUTHENTICATE USER.
	const location = useLocation();
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		setIsAuthenticated(token !== null);
	}, [location]);

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
