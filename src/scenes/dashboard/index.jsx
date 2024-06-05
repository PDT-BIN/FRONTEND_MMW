import { useTheme } from "@emotion/react";
import { Box, Button, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CategoryIcon from "@mui/icons-material/Category";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { tokens } from "../../theme";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DateTimeUtil } from "../../utils";

const StatisticBox = ({ title, subtitle, progress, increase, icon }) => {
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
				title={title}
				subtitle={subtitle}
				progress={progress}
				increase={`+${increase}%`}
				icon={icon}
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

	const handleImportExportStatistic = (e) => {
		console.log(e._d.getFullYear());
	};

	const handleFavourteProductStatistic = (e) => {
		console.log(e._d.getMonth());
		console.log(e._d.getFullYear());
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
					title={0}
					subtitle="NEW CUSTOMER"
					progress={0}
					increase={0}
					icon={
						<PersonAddAlt1Icon
							fontSize="large"
							sx={{ color: colors.greenAccent[600] }}
						/>
					}
				/>

				<StatisticBox
					title={0}
					subtitle="NEW PRODUCT"
					progress={0}
					increase={0}
					icon={
						<CategoryIcon
							fontSize="large"
							sx={{ color: colors.greenAccent[600] }}
						/>
					}
				/>

				<StatisticBox
					title={0}
					subtitle="IMPORT FEE"
					progress={0}
					increase={0}
					icon={
						<BookmarkAddIcon
							fontSize="large"
							sx={{ color: colors.greenAccent[600] }}
						/>
					}
				/>

				<StatisticBox
					title={0}
					subtitle="EXPORT FEE"
					progress={0}
					increase={0}
					icon={
						<BookmarkRemoveIcon
							fontSize="large"
							sx={{ color: colors.greenAccent[600] }}
						/>
					}
				/>
				{/* ROW 2 */}
				<ChartBox
					column="7"
					row="2"
					title="IMPORT & EXPORT"
					chart={<BarChart />}
					formats={{ format: "YYYY", views: ["year"] }}
					handleChange={handleImportExportStatistic}
				/>

				<ChartBox
					column="5"
					row="2"
					title="FAVOURITE PRODUCTS"
					chart={<PieChart />}
					formats={{ format: "MM/YYYY", views: ["month", "year"] }}
					handleChange={handleFavourteProductStatistic}
				/>
			</Box>
		</Box>
	);
}
