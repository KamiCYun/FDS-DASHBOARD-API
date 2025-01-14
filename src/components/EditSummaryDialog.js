import React, { useState } from "react";
import { Dialog, Pane, Text, TextInput } from "evergreen-ui";
import { useTheme } from "../App"; // Import ThemeContext

const EditSummaryDialog = ({ isShown, onClose, semesterData, onSave }) => {
  const [tempData, setTempData] = useState({ ...semesterData });
  const { theme } = useTheme(); // Access the current theme

  const handleChange = (key, value) => {
    setTempData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(tempData);
    onClose();
  };

  const dynamicStyles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#121212",
    textColor: theme === "light" ? "#000000" : "#e0e0e0",
    inputBackground: theme === "light" ? "#f9f9f9" : "#2e2e2e",
    inputTextColor: theme === "light" ? "#000000" : "#e0e0e0",
    overlayBackground: theme === "light" ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.1)",
  };

  return (
    <Dialog
      isShown={isShown}
      title="Edit Summary"
      onCloseComplete={onClose}
      onConfirm={handleSave}
      confirmLabel="Save"
      style={{
        backgroundColor: dynamicStyles.backgroundColor,
        color: dynamicStyles.textColor,
      }}
      overlayContainerProps={{
        style: {
          backgroundColor: dynamicStyles.overlayBackground,
        },
      }}
      titleStyle={{
        color: dynamicStyles.textColor,
      }}
    >
      <Pane display="flex" flexDirection="column" gap={16}>
        {/* Starting Capital */}
        <Pane>
          <Text color={dynamicStyles.textColor}>Starting Capital:</Text>
          <TextInput
            placeholder="Edit Starting Capital"
            value={tempData.startingCapital}
            onChange={(e) =>
              handleChange("startingCapital", parseFloat(e.target.value))
            }
            style={{
              backgroundColor: dynamicStyles.inputBackground,
              color: dynamicStyles.inputTextColor,
            }}
          />
        </Pane>

        {/* Active House Size */}
        <Pane>
          <Text color={dynamicStyles.textColor}>Active House Size:</Text>
          <TextInput
            placeholder="Edit Active House Size"
            value={tempData.activeHouseSize}
            onChange={(e) =>
              handleChange("activeHouseSize", parseInt(e.target.value, 10))
            }
            style={{
              backgroundColor: dynamicStyles.inputBackground,
              color: dynamicStyles.inputTextColor,
            }}
          />
        </Pane>

        {/* Insurance Cost */}
        <Pane>
          <Text color={dynamicStyles.textColor}>Insurance Cost:</Text>
          <TextInput
            placeholder="Edit Insurance Cost"
            value={tempData.insurance}
            onChange={(e) =>
              handleChange("insurance", parseFloat(e.target.value))
            }
            style={{
              backgroundColor: dynamicStyles.inputBackground,
              color: dynamicStyles.inputTextColor,
            }}
          />
        </Pane>
      </Pane>
    </Dialog>
  );
};

export default EditSummaryDialog;
