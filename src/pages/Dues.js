import React, { useState } from "react";
import { Pane, Heading, TextInputField, Button, Text, Tooltip, InfoSignIcon } from "evergreen-ui";
import { useTheme } from "../App"; // Import ThemeContext

const Dues = () => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic styles based on the theme
  const dynamicStyles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#121212",
    textColor: theme === "light" ? "#000000" : "#e0e0e0",
    inputBackground: theme === "light" ? "#f9f9f9" : "#2e2e2e",
    inputTextColor: theme === "light" ? "#000000" : "#e0e0e0",
    buttonBackground: theme === "light" ? "#007bff" : "#004d40", // Dark green for dark mode
    buttonTextColor: theme === "light" ? "#ffffff" : "#e0e0e0",
    infoColor: theme === "light" ? "#007bff" : "#00acc1",
  };

  // State for variables
  const [totalAmountDue, setTotalAmountDue] = useState("");
  const [miscExpenses, setMiscExpenses] = useState("");
  const [startingCapital, setStartingCapital] = useState("");
  const [nextSemesterAmountDue, setNextSemesterAmountDue] = useState("");
  const [semestersAhead, setSemestersAhead] = useState("");
  const [activeHouse, setActiveHouse] = useState("");
  const [dues, setDues] = useState(null);

  // Formula for calculating dues
  const calculateDues = () => {
    const total = parseFloat(totalAmountDue || 0);
    const misc = parseFloat(miscExpenses || 0);
    const starting = parseFloat(startingCapital || 0);
    const next = parseFloat(nextSemesterAmountDue || 0);
    const ahead = parseFloat(semestersAhead || 0) / 100; // Convert percentage to decimal
    const house = parseFloat(activeHouse || 0);

    if (house === 0) {
      setDues("Active house size cannot be zero.");
      return;
    }

    const duesAmount =
      ((total + misc - starting) + (next * (ahead + 0.1))) / house;

    setDues(duesAmount.toFixed(2)); // Format to 2 decimal places
  };

  return (
    <Pane
      padding={16}
      style={{
        backgroundColor: dynamicStyles.backgroundColor,
        color: dynamicStyles.textColor,
      }}
    >
      <Heading
        size={800}
        marginBottom={16}
        style={{
          color: dynamicStyles.textColor,
        }}
      >
        Calculate Dues
      </Heading>
      <Pane
        display="flex"
        flexDirection="column"
        gap={16}
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Pane>
          <TextInputField
            label={
              <Pane display="flex" alignItems="center" gap={8}>
                Total Amount Due
                <Tooltip content="The total insurance cost for this semester.">
                  <InfoSignIcon color={dynamicStyles.infoColor} />
                </Tooltip>
              </Pane>
            }
            type="number"
            value={totalAmountDue}
            onChange={(e) => setTotalAmountDue(e.target.value)}
            background={dynamicStyles.inputBackground}
            color={dynamicStyles.inputTextColor}
          />
        </Pane>
        <Pane>
          <TextInputField
            label={
              <Pane display="flex" alignItems="center" gap={8}>
                Misc Expenses
                <Tooltip content="Estimated total expenses for this semester.">
                  <InfoSignIcon color={dynamicStyles.infoColor} />
                </Tooltip>
              </Pane>
            }
            type="number"
            value={miscExpenses}
            onChange={(e) => setMiscExpenses(e.target.value)}
            background={dynamicStyles.inputBackground}
            color={dynamicStyles.inputTextColor}
          />
        </Pane>
        <Pane>
          <TextInputField
            label={
              <Pane display="flex" alignItems="center" gap={8}>
                Starting Capital
                <Tooltip content="The starting capital available at the beginning of the semester.">
                  <InfoSignIcon color={dynamicStyles.infoColor} />
                </Tooltip>
              </Pane>
            }
            type="number"
            value={startingCapital}
            onChange={(e) => setStartingCapital(e.target.value)}
            background={dynamicStyles.inputBackground}
            color={dynamicStyles.inputTextColor}
          />
        </Pane>
        <Pane>
          <TextInputField
            label={
              <Pane display="flex" alignItems="center" gap={8}>
                Next Semester Amount Due
                <Tooltip content="The insurance cost for the next semester.">
                  <InfoSignIcon color={dynamicStyles.infoColor} />
                </Tooltip>
              </Pane>
            }
            type="number"
            value={nextSemesterAmountDue}
            onChange={(e) => setNextSemesterAmountDue(e.target.value)}
            background={dynamicStyles.inputBackground}
            color={dynamicStyles.inputTextColor}
          />
        </Pane>
        <Pane>
          <TextInputField
            label={
              <Pane display="flex" alignItems="center" gap={8}>
                Semesters Ahead (%)
                <Tooltip content="The percentage of next semester's insurance costs to be included in this semester's dues (entered as a percentage).">
                  <InfoSignIcon color={dynamicStyles.infoColor} />
                </Tooltip>
              </Pane>
            }
            type="number"
            value={semestersAhead}
            onChange={(e) => setSemestersAhead(e.target.value)}
            background={dynamicStyles.inputBackground}
            color={dynamicStyles.inputTextColor}
          />
        </Pane>
        <Pane>
          <TextInputField
            label={
              <Pane display="flex" alignItems="center" gap={8}>
                Active House Size
                <Tooltip content="The number of active members in the house.">
                  <InfoSignIcon color={dynamicStyles.infoColor} />
                </Tooltip>
              </Pane>
            }
            type="number"
            value={activeHouse}
            onChange={(e) => setActiveHouse(e.target.value)}
            background={dynamicStyles.inputBackground}
            color={dynamicStyles.inputTextColor}
          />
        </Pane>
        <Button
          appearance="primary"
          style={{
            backgroundColor: dynamicStyles.buttonBackground,
            color: dynamicStyles.buttonTextColor,
          }}
          onClick={calculateDues}
        >
          Calculate
        </Button>
        {dues !== null && (
          <Text
            size={600}
            marginTop={16}
            style={{ color: dynamicStyles.textColor }}
          >
            <strong>Minimum Dues Per Member:</strong> {isNaN(dues) ? dues : `$${dues}`}
          </Text>
        )}
      </Pane>
    </Pane>
  );
};

export default Dues;
