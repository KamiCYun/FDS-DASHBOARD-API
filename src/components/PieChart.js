import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../App"; // Import ThemeContext

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic colors based on the theme
  const dynamicColors = {
    backgroundColors: theme === "light"
      ? ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"] // Bright colors for light mode
      : ["#355E3B", "#673AB7", "#FFCE56", "#26C6DA", "#8E44AD"], // Muted colors for dark mode
    textColor: theme === "light" ? "#000000" : "#F3EEED", // Axis/legend text color
  };

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: dynamicColors.backgroundColors,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          color: dynamicColors.textColor, // Adjust legend text color
        },
      },
      tooltip: {
        backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e", // Tooltip background color
        titleColor: theme === "light" ? "#000000" : "#e0e0e0", // Tooltip title color
        bodyColor: theme === "light" ? "#000000" : "#e0e0e0", // Tooltip body text color
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
