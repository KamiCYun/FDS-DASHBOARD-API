import React, { useState } from "react";
import {
  Pane,
  Heading,
  Button,
  SelectMenu,
  Dialog,
  TextInput,
} from "evergreen-ui";
import { useTheme } from "../App"; // Import ThemeContext
import Statistics from "../components/Statistics";
import TransactionsTable from "../components/TransactionsTable";
import EditSummaryDialog from "../components/EditSummaryDialog";
import ManageCategoriesDialog from "../components/ManageCategoriesDialog";

const HomePage = () => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic styles based on the theme
  const dynamicStyles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#121212",
    textColor: theme === "light" ? "#000000" : "#e0e0e0",
    buttonBackground: theme === "light" ? "#007bff" : "#673ab7",
    buttonTextColor: theme === "light" ? "#ffffff" : "#e0e0e0",
    inputBackground: theme === "light" ? "#f9f9f9" : "#2e2e2e",
    inputTextColor: theme === "light" ? "#000000" : "#e0e0e0",
  };

  const [semesters, setSemesters] = useState(["Fall 2023", "Spring 2024"]);
  const [selectedSemester, setSelectedSemester] = useState("Fall 2023");
  const [isEditDialogShown, setIsEditDialogShown] = useState(false);
  const [isCategoryDialogShown, setIsCategoryDialogShown] = useState(false);
  const [isNewSemesterDialogShown, setIsNewSemesterDialogShown] =
    useState(false);
  const [isDeleteSemesterDialogShown, setIsDeleteSemesterDialogShown] =
    useState(false);
  const [newSemesterName, setNewSemesterName] = useState("");
  const [categories, setCategories] = useState([
    "Dues",
    "Event",
    "Uncategorized",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterData, setSemesterData] = useState({
    "Fall 2023": {
      startingCapital: 1000,
      activeHouseSize: 27,
      insurance: 5000,
      transactions: [
        {
          payer: "John",
          time: "2023-09-01",
          message: "Dues",
          category: "Dues",
          amount: 300,
        },
        {
          payer: "Jane",
          time: "2023-09-05",
          message: "Event Fee",
          category: "Event",
          amount: -100,
        },
      ],
    },
    "Spring 2024": {
      startingCapital: 2000,
      activeHouseSize: 30,
      insurance: 5500,
      transactions: [
        {
          payer: "Emma",
          time: "2024-01-10",
          message: "Dues",
          category: "Dues",
          amount: 400,
        },
        {
          payer: "Luke",
          time: "2024-02-15",
          message: "Fundraiser",
          category: "Dues",
          amount: 500,
        },
      ],
    },
  });

  const calculateCurrentCapital = () => {
    const data = semesterData[selectedSemester];
    return (
      data.startingCapital +
      data.transactions.reduce((sum, txn) => sum + txn.amount, 0)
    );
  };

  const calculateSurplus = () => {
    const data = semesterData[selectedSemester];
    return calculateCurrentCapital() - data.startingCapital;
  };

  const handleCreateNewSemester = () => {
    if (!newSemesterName.trim() || semesters.includes(newSemesterName.trim())) {
      return; // Ignore empty or duplicate semester names
    }
    setSemesters((prev) => [...prev, newSemesterName.trim()]);
    setSemesterData((prevData) => ({
      ...prevData,
      [newSemesterName.trim()]: {
        startingCapital: 0,
        activeHouseSize: 0,
        insurance: 0,
        transactions: [],
      },
    }));
    setSelectedSemester(newSemesterName.trim()); // Automatically switch to the new semester
    setNewSemesterName(""); // Clear the input
    setIsNewSemesterDialogShown(false); // Close the dialog
  };

  const handleDeleteSemester = () => {
    const updatedSemesters = semesters.filter((sem) => sem !== selectedSemester);
    const nextSemester = updatedSemesters.length > 0 ? updatedSemesters[0] : null;

    setSemesters(updatedSemesters);
    setSelectedSemester(nextSemester);
    setSemesterData((prevData) => {
      const { [selectedSemester]: _, ...rest } = prevData; // Remove the selected semester
      return rest;
    });

    setIsDeleteSemesterDialogShown(false);
  };

  const filteredTransactions =
    semesterData[selectedSemester]?.transactions.filter((txn) =>
      Object.values(txn)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

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
        style={{ color: dynamicStyles.textColor }}
      >
        PHI DELTA SIGMA FINANCIAL DASHBOARD
      </Heading>
      <Pane display="flex" alignItems="center" gap={8}>
        <SelectMenu
          title="Select Semester"
          options={semesters.map((semester) => ({
            label: semester,
            value: semester,
          }))}
          selected={selectedSemester}
          onSelect={(item) => setSelectedSemester(item.value)}
        >
          <Button
            style={{
              backgroundColor: dynamicStyles.buttonBackground,
              color: dynamicStyles.buttonTextColor,
            }}
          >
            {selectedSemester || "No Semesters Available"}
          </Button>
        </SelectMenu>
        <Button
          onClick={() => setIsEditDialogShown(true)}
          style={{
            backgroundColor: dynamicStyles.buttonBackground,
            color: dynamicStyles.buttonTextColor,
          }}
        >
          Edit Summary
        </Button>
        <Button
          onClick={() => setIsCategoryDialogShown(true)}
          style={{
            backgroundColor: dynamicStyles.buttonBackground,
            color: dynamicStyles.buttonTextColor,
          }}
        >
          Manage Categories
        </Button>
        <Button
          onClick={() => setIsNewSemesterDialogShown(true)}
          style={{
            backgroundColor: dynamicStyles.buttonBackground,
            color: dynamicStyles.buttonTextColor,
          }}
        >
          Create New Semester
        </Button>
        {selectedSemester && (
          <Button
            onClick={() => setIsDeleteSemesterDialogShown(true)}
            intent="danger"
          >
            Delete Semester
          </Button>
        )}
      </Pane>

      {selectedSemester && (
        <>
          <Statistics
            startingCapital={semesterData[selectedSemester].startingCapital}
            currentCapital={calculateCurrentCapital()}
            surplus={calculateSurplus()}
            activeHouseSize={semesterData[selectedSemester].activeHouseSize}
            insurance={semesterData[selectedSemester].insurance}
            transactions={semesterData[selectedSemester].transactions}
            categories={categories}
          />

          <Pane marginTop={16}>
            <TextInput
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              width="100%"
              marginBottom={16}
              style={{
                backgroundColor: dynamicStyles.inputBackground,
                color: dynamicStyles.inputTextColor,
              }}
            />
            <TransactionsTable
              transactions={filteredTransactions || []}
              categories={categories}
              setSemesterData={(newTransactions) =>
                setSemesterData((prevData) => ({
                  ...prevData,
                  [selectedSemester]: {
                    ...prevData[selectedSemester],
                    transactions: newTransactions,
                  },
                }))
              }
            />
          </Pane>
        </>
      )}

      <EditSummaryDialog
        isShown={isEditDialogShown}
        onClose={() => setIsEditDialogShown(false)}
        semesterData={semesterData[selectedSemester]}
        onSave={(updatedValues) =>
          setSemesterData((prevData) => ({
            ...prevData,
            [selectedSemester]: {
              ...prevData[selectedSemester],
              ...updatedValues,
            },
          }))
        }
      />
      <ManageCategoriesDialog
        isShown={isCategoryDialogShown}
        onClose={() => setIsCategoryDialogShown(false)}
        categories={categories}
        onAddCategory={(newCategory) => {
          if (!categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
          }
        }}
        onDeleteCategory={(category) => {
          if (category === "Uncategorized") return;
          const updatedTransactions =
            semesterData[selectedSemester].transactions.map((txn) =>
              txn.category === category
                ? { ...txn, category: "Uncategorized" }
                : txn
            );
          setCategories(categories.filter((cat) => cat !== category));
          setSemesterData((prevData) => ({
            ...prevData,
            [selectedSemester]: {
              ...prevData[selectedSemester],
              transactions: updatedTransactions,
            },
          }));
        }}
      />

      <Dialog
        isShown={isNewSemesterDialogShown}
        title="Create New Semester"
        onCloseComplete={() => setIsNewSemesterDialogShown(false)}
        confirmLabel="Create"
        onConfirm={handleCreateNewSemester}
        style={{
          backgroundColor: dynamicStyles.backgroundColor,
          color: dynamicStyles.textColor,
        }}
      >
        <TextInput
          placeholder="Enter new semester name"
          value={newSemesterName}
          onChange={(e) => setNewSemesterName(e.target.value)}
          style={{
            backgroundColor: dynamicStyles.inputBackground,
            color: dynamicStyles.inputTextColor,
          }}
        />
      </Dialog>

      <Dialog
        isShown={isDeleteSemesterDialogShown}
        title="Delete Semester"
        onCloseComplete={() => setIsDeleteSemesterDialogShown(false)}
        confirmLabel="Delete"
        intent="danger"
        onConfirm={handleDeleteSemester}
      >
        Are you sure you want to delete the semester "{selectedSemester}"? This action cannot be undone.
      </Dialog>
    </Pane>
  );
};

export default HomePage;
