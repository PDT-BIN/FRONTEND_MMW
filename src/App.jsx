import { Route, Routes, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./scenes/auth/Login";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/index";
import Employee from "./scenes/employee";
import Partner from "./scenes/partner";
import Product from "./scenes/product";
import Order from "./scenes/form_order";
import Import from "./scenes/form_import";
import Export from "./scenes/form_export";
import { ColorModeContext, useMode } from "./theme";

function App() {
	const [theme, colorMode] = useMode();
	const location = useLocation();
	const isAuthPage = location.pathname === "/login";

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{isAuthPage ? (
					<Routes>
						<Route path="/login" element={<Login />} />
					</Routes>
				) : (
					<div className="app">
						<Sidebar />
						<main className="content">
							<Topbar />
							<Routes>
								{/* <Route path="/" element={<ProtectedRoute />}> */}
								<Route path="/" element={<Dashboard />} />
								{/* INFORMATION */}
								<Route
									path="/employee"
									element={<Employee />}
								/>
								<Route path="/partner" element={<Partner />} />
								<Route path="/product" element={<Product />} />
								{/* RECEIPT */}
								<Route path="/order" element={<Order />} />
								<Route path="/import" element={<Import />} />
								<Route path="/export" element={<Export />} />
								{/* </Route> */}
							</Routes>
						</main>
					</div>
				)}
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
