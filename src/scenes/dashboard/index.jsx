import { useTheme } from "@emotion/react";
import { Box, Button, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CategoryIcon from "@mui/icons-material/Category";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { ColorModeContext, tokens } from "../../theme";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import AxiosInstance from "../../api/api";
import { DATA_NOTICE } from "../../notice";
import { useContext, useEffect, useState } from "react";

const StatisticBox = ({ subtitle, data, icon, onlyTotal = false }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			gridColumn="span 3"
			gridRow="span 1"
			backgroundColor={colors.primary[400]}
			display="flex"
			alignItems="center"
			justifyContent="center"
			borderRadius="5px"
		>
			<StatBox
				title={Math.ceil(data.current || 0)}
				subtitle={subtitle}
				progress={data.percentage || 0}
				increase={`${(data.increase || 0) > 0 ? "+" : ""}${Math.ceil(
					data.increase || 0
				)}`}
				icon={icon}
				onlyTotal={onlyTotal}
			/>
		</Box>
	);
};

const ChartBox = ({ column, row, title, chart, formats, handleChange }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			padding="20px"
			gridColumn={`span ${column}`}
			gridRow={`span ${row}`}
			borderRadius="5px"
			bgcolor={colors.primary[400]}
			overflow="hidden"
		>
			<Box
				display="flex"
				justifyContent="space-between"
				position="relative"
			>
				<Typography variant="h6" color={colors.grey[100]}>
					{title}
				</Typography>
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DatePicker
						label="PERIOD"
						format={formats.format}
						views={formats.views}
						defaultValue={moment(Date.now())}
						onChange={handleChange}
						sx={{
							position: "absolute",
							right: "0",
							zIndex: 1,
							width: "150px",
						}}
					/>
				</LocalizationProvider>
			</Box>
			<Box height="100%">{chart}</Box>
		</Box>
	);
};

export default function Dashboard() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// API.
	const { setAlert } = useContext(ColorModeContext);
	const [barChartData, setBarChartData] = useState([]);
	const [pieChartData, setPieChartData] = useState([]);
	const [totalImportData, setTotalImportData] = useState([]);
	const [totalExportData, setTotalExportData] = useState([]);
	const [totalCustomer, setTotalCustomer] = useState(null);
	const [totalProduct, setTotalProduct] = useState(null);

	useEffect(() => {
		handleTotalPartnerAndProduct();
		handleImportExportStatistic();
		handleFavourteProductStatistic();
		handleTotalImportStatistic();
		handleTotalExportStatistic();
	}, []);

	// CALL API TOTAL BUSINESS PARTNER & PRODUCT.
	const handleTotalPartnerAndProduct = () => {
		AxiosInstance.get("api/web/business_Partner/")
			.then((response) => setTotalCustomer(response.data.length))
			.catch((_) => setAlert(DATA_NOTICE));
		AxiosInstance.get("api/web/product/")
			.then((response) => setTotalProduct(response.data.length))
			.catch((_) => setAlert(DATA_NOTICE));
	};

	// CALL API TOTAL IMPORT STATISTIC.
	const handleTotalImportStatistic = () => {
		AxiosInstance.get("api/web/stats/total_import/")
			.then((response) => setTotalImportData(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	};

	// CALL API TOTAL EXPORT STATISTIC.
	const handleTotalExportStatistic = () => {
		AxiosInstance.get("api/web/stats/total_export/")
			.then((response) => setTotalExportData(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	};

	// CALL API IMPORT & EXPORT STATISTIC.
	const handleImportExportStatistic = (e) => {
		const TODAY = new Date();
		AxiosInstance.post("api/web/stats/import_export/", {
			year: e?._d.getFullYear() || TODAY.getFullYear(),
		})
			.then((response) => setBarChartData(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	};

	// CALL API FAVOURITE PRODUCT STATISTIC.
	const handleFavourteProductStatistic = (e) => {
		const TODAY = new Date();
		AxiosInstance.post("api/web/stats/top5_export/", {
			month: e?._d.getMonth() + 1 || TODAY.getMonth() + 1,
			year: e?._d.getFullYear() || TODAY.getFullYear(),
		})
			.then((response) => setPieChartData(response.data))
			.catch((_) => setAlert(DATA_NOTICE));
	};

	return (
		<Box height="75vh" m="20px">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Header title="DASHBOARD" subtitle="Welcome to dashboard!" />

				<Box>
					<Button
						sx={{
							fontWeight: "bold",
							padding: "10px 15px",
							color: colors.grey[100],
							backgroundColor: colors.blueAccent[700],
						}}
					>
						<DownloadOutlinedIcon sx={{ mr: "10px" }} />
						DOWNLOAD REPORTS
					</Button>
				</Box>
			</Box>

			{/* GRID & CHARTS */}
			<Box
				mt="20px"
				height="100%"
				display="grid"
				gridTemplateColumns="repeat(12, 1fr)"
				gridTemplateRows="repeat(3, 1fr)"
				gap="20px"
			>
				{/* ROW 1 */}
				<StatisticBox
					subtitle="BUSINESS PARTNER"
					data={{ current: totalCustomer }}
					icon={
						<PersonAddAlt1Icon
							fontSize="large"
							sx={{
								color: colors.greenAccent[600],
								width: "36px",
								height: "36px",
							}}
						/>
					}
					onlyTotal={true}
				/>

				<StatisticBox
					subtitle="PRODUCT"
					data={{ current: totalProduct }}
					icon={
						<CategoryIcon
							sx={{
								color: colors.greenAccent[600],
								width: "36px",
								height: "36px",
							}}
						/>
					}
					onlyTotal={true}
				/>

				<StatisticBox
					subtitle="IMPORT FEE"
					data={totalImportData}
					icon={
						<BookmarkAddIcon
							sx={{
								color: colors.greenAccent[600],
								width: "36px",
								height: "36px",
							}}
						/>
					}
				/>

				<StatisticBox
					subtitle="EXPORT FEE"
					data={totalExportData}
					icon={
						<BookmarkRemoveIcon
							sx={{
								color: colors.greenAccent[600],
								width: "36px",
								height: "36px",
							}}
						/>
					}
				/>
				{/* ROW 2 */}
				<ChartBox
					column="7"
					row="2"
					title="IMPORT & EXPORT"
					chart={<BarChart data={barChartData} />}
					formats={{ format: "YYYY", views: ["year"] }}
					handleChange={handleImportExportStatistic}
				/>

				<ChartBox
					column="5"
					row="2"
					title="FAVOURITE PRODUCTS"
					chart={<PieChart data={pieChartData} />}
					formats={{ format: "MM/YYYY", views: ["month", "year"] }}
					handleChange={handleFavourteProductStatistic}
				/>
			</Box>
		</Box>
	);
}
