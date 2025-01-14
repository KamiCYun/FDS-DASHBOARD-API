import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../App"; // Import ThemeContext

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineGraph = ({ data }) => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic colors based on the theme
  const dynamicColors = {
    borderColor: theme === "light" ? "#36A2EB" : "#BB86FC", // Blue for light, purple for dark
    backgroundColor: theme === "light" ? "rgba(54, 162, 235, 0.2)" : "rgba(187, 134, 252, 0.2)", // Light or dark background
    textColor: theme === "light" ? "#000000" : "#e0e0e0", // Text color for labels
    gridColor: theme === "light" ? "#e4e4e4" : "#444444", // Grid color
  };

  const chartData = {
    labels: data.map((_, index) => `Week ${index + 1}`),
    datasets: [
      {
        label: "Weekly Balance",
        data: data,
        borderColor: dynamicColors.borderColor,
        backgroundColor: dynamicColors.backgroundColor,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: dynamicColors.textColor, // Adjust legend text color
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: dynamicColors.textColor, // Adjust x-axis label color
        },
        grid: {
          color: dynamicColors.gridColor, // Adjust gridline color for x-axis
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: dynamicColors.textColor, // Adjust y-axis label color
        },
        grid: {
          color: dynamicColors.gridColor, // Adjust gridline color for y-axis
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineGraph;
