import React from "react";
import { Pane, Text } from "evergreen-ui";
import LineGraph from "./LineGraph";
import PieChart from "./PieChart";
import { useTheme } from "../App"; // Import ThemeContext

const Statistics = ({
  startingCapital,
  currentCapital,
  surplus,
  activeHouseSize,
  insurance,
  transactions,
}) => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic styles based on the theme
  const dynamicStyles = {
    textColor: theme === "light" ? "#000000" : "#e0e0e0",
    backgroundColor: theme === "light" ? "#f9f9f9" : "#121212",
    borderColor: theme === "light" ? "#e4e7eb" : "#444444",
  };

  const calculateCategoryBreakdown = () => {
    const breakdown = {};
    transactions.forEach((txn) => {
      breakdown[txn.category] = (breakdown[txn.category] || 0) + txn.amount;
    });
    return breakdown;
  };

  const calculateWeeklyBalances = () => {
    const weeklyBalances = [];
    let runningTotal = startingCapital;
    transactions.forEach((txn) => {
      runningTotal += txn.amount;
      weeklyBalances.push(runningTotal);
    });
    return weeklyBalances;
  };

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={16}
      style={{
        backgroundColor: dynamicStyles.backgroundColor,
        color: dynamicStyles.textColor,
        border: `1px solid ${dynamicStyles.borderColor}`,
        padding: 16,
        borderRadius: 8,
      }}
    >
      {/* Summary Section */}
      <Pane
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={16}
      >
        <Text size={600} color={dynamicStyles.textColor}>
          <strong>Starting Capital:</strong> ${startingCapital}
        </Text>
        <Text size={600} color={dynamicStyles.textColor}>
          <strong>Current Capital:</strong> ${currentCapital}
        </Text>
        <Text size={600} color={dynamicStyles.textColor}>
          <strong>Surplus/Negative:</strong> ${surplus}
        </Text>
        <Text size={600} color={dynamicStyles.textColor}>
          <strong>Active House Size:</strong> {activeHouseSize}
        </Text>
        <Text size={600} color={dynamicStyles.textColor}>
          <strong>Insurance Cost:</strong> ${insurance}
        </Text>
      </Pane>

      {/* Line Graph Section */}
      <Pane flex="2" height={300} style={{ backgroundColor: dynamicStyles.backgroundColor }}>
        <LineGraph data={calculateWeeklyBalances()} />
      </Pane>

      {/* Pie Chart Section */}
      <Pane flex="2" height={400} style={{ backgroundColor: dynamicStyles.backgroundColor }}>
        <PieChart data={calculateCategoryBreakdown()} />
      </Pane>
    </Pane>
  );
};

export default Statistics;
