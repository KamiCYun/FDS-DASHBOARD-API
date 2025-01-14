import React, { useState } from "react";
import { Dialog, Pane, Text, TextInput, Button } from "evergreen-ui";
import { useTheme } from "../App"; // Import ThemeContext

const ManageCategoriesDialog = ({
  isShown,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic styles based on the theme
  const dynamicStyles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
    textColor: theme === "light" ? "#000000" : "#e0e0e0",
    inputBackground: theme === "light" ? "#f9f9f9" : "#2e2e2e",
    inputTextColor: theme === "light" ? "#000000" : "#e0e0e0",
    buttonBackground: theme === "light" ? "#007bff" : "#673ab7",
    buttonTextColor: theme === "light" ? "#ffffff" : "#e0e0e0",
  };

  return (
    <Dialog
      isShown={isShown}
      title="Manage Categories"
      onCloseComplete={onClose}
      confirmLabel="Done"
      style={{
        backgroundColor: dynamicStyles.backgroundColor,
        color: dynamicStyles.textColor,
      }}
      titleStyle={{
        color: dynamicStyles.textColor,
      }}
    >
      <Pane display="flex" flexDirection="column" gap={16}>
        {/* Add a New Category */}
        <Pane>
          <Text color={dynamicStyles.textColor}>Add a New Category:</Text>
          <TextInput
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newCategory.trim()) {
                onAddCategory(newCategory.trim());
                setNewCategory("");
              }
            }}
            style={{
              backgroundColor: dynamicStyles.inputBackground,
              color: dynamicStyles.inputTextColor,
            }}
          />
          <Button
            appearance="primary"
            marginTop={8}
            onClick={() => {
              if (newCategory.trim()) {
                onAddCategory(newCategory.trim());
                setNewCategory("");
              }
            }}
            style={{
              backgroundColor: dynamicStyles.buttonBackground,
              color: dynamicStyles.buttonTextColor,
            }}
          >
            Add
          </Button>
        </Pane>

        {/* Existing Categories */}
        <Pane>
          <Text color={dynamicStyles.textColor}>Existing Categories:</Text>
          {categories.map((cat) => (
            <Pane
              key={cat}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginTop={8}
              style={{
                color: dynamicStyles.textColor,
              }}
            >
              <Text color={dynamicStyles.textColor}>{cat}</Text>
              {cat !== "Uncategorized" && (
                <Button
                  appearance="minimal"
                  intent="danger"
                  onClick={() => onDeleteCategory(cat)}
                  style={{
                    color: dynamicStyles.textColor,
                  }}
                >
                  Delete
                </Button>
              )}
            </Pane>
          ))}
        </Pane>
      </Pane>
    </Dialog>
  );
};

export default ManageCategoriesDialog;
