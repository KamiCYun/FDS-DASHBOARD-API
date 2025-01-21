import React, { useState } from "react";
import { Dialog, Pane, Text, TextInput, Button } from "evergreen-ui";
import { useTheme } from "../App"; // Import ThemeContext
import "../App.css"; // Import the CSS file with overrides

const ManageCategoriesDialog = ({
  isShown,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const { theme } = useTheme(); // Access the current theme

  return (
    <Dialog
      isShown={isShown}
      title="Manage Categories"
      onCloseComplete={onClose}
      className="evergreen-dialog"
      contentContainerProps={{
        style: {
          backgroundColor: theme === "light" ? "#ffffff" : "#282828",
          color: theme === "light" ? "#000000" : "#F3EEED",
        },
      }}
      overlayProps={{
        style: {
          backgroundColor:
            theme === "light" ? "rgba(0, 0, 0, 0.3)" : "#282828",
        },
      }}
      renderFooter={(close) => (
        <Pane
          display="flex"
          justifyContent="flex-end"
          padding={16}
          background={theme === "light" ? "#006400" : "#355E3B"}
        >
          <Button
            onClick={close}
            style={{
              backgroundColor: theme === "light" ? "#006400" : "#355E3B", // Dark green button
              color: theme === "light" ? "#FFC0CB" : "#ffffff", // Pink text
              border: "none",
            }}
          >
            Done
          </Button>
        </Pane>
      )}
    >
      <Pane display="flex" flexDirection="column" gap={16}>
        {/* Add a New Category */}
        <Pane display="flex" alignItems="center" gap={8}>
          <Text
            color={theme === "light" ? "#000000" : "#F3EEED"}
            flex="1"
          >
            Add a New Category:
          </Text>
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
              backgroundColor: theme === "light" ? "#f9f9f9" : "#282828",
              color: theme === "light" ? "#000000" : "#F3EEED",
              flex: 2,
            }}
          />
          <Button
            appearance="primary"
            marginLeft="auto" // Align button to the right
            onClick={() => {
              if (newCategory.trim()) {
                onAddCategory(newCategory.trim());
                setNewCategory("");
              }
            }}
            style={{
              backgroundColor: theme === "light" ? "#007bff" : "#355E3B",
              color: theme === "light" ? "#ffffff" : "#F3EEED",
            }}
          >
            Add
          </Button>
        </Pane>

        {/* Existing Categories */}
        <Pane>
          <Text color={theme === "light" ? "#000000" : "#F3EEED"}>
            Existing Categories:
          </Text>
          {categories.map((cat) => (
            <Pane
              key={cat}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginTop={8}
            >
              <Text color={theme === "light" ? "#000000" : "#F3EEED"}>
                {cat}
              </Text>
              {cat !== "Uncategorized" && (
                <Button
                  appearance="primary"
                  onClick={() => onDeleteCategory(cat)}
                  style={{
                    backgroundColor: theme === "light" ? "#007bff" : "#355E3B",
                    color: theme === "light" ? "#ffffff" : "#F3EEED",
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
