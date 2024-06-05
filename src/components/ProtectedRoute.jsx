import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator.jsx";
import {
	ACCESS_TOKEN,
	IS_MANAGER,
	PROFILE_ID,
	USER_ID,
} from "../api/constants.js";

function ProtectedRoute() {
	// AUTHENTICATE USER.
	const location = useLocation();
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		const userId = localStorage.getItem(USER_ID);
		const profileId = localStorage.getItem(PROFILE_ID);
		const role = localStorage.getItem(IS_MANAGER);
		setIsAuthenticated(
			token !== null &&
				userId !== null &&
				profileId !== null &&
				role !== null
		);
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
