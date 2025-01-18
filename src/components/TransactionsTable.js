import React, { useState } from "react";
import { Table, SelectMenu, Button, Pane } from "evergreen-ui";
import { useTheme } from "../App"; // Import ThemeContext

const API_BASE_URL = "https://api-pihdtekhfq-uc.a.run.app";
const TransactionsTable = ({ transactions, categories, setSemesterData, pageSize = 10 }) => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic styles based on the theme
  const dynamicStyles = {
    textColor: theme === "light" ? "#000000" : "#e0e0e0",
    backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
    headerBackgroundColor: theme === "light" ? "#f9f9f9" : "#2e2e2e",
    borderColor: theme === "light" ? "#e4e7eb" : "#444444",
    buttonBackgroundColor: theme === "light" ? "#007bff" : "#673ab7",
    buttonTextColor: theme === "light" ? "#ffffff" : "#e0e0e0",
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / pageSize);

  // Get the transactions for the current page
  const getCurrentPageTransactions = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return transactions.slice(start, end);
  };

  const handleCategoryChange = (index, newCategory) => {
    const updatedTransactions = [...transactions];
    const globalIndex = (currentPage - 1) * pageSize + index; // Map index to global transaction index
    const transactionId = updatedTransactions[globalIndex].id;
  
    // Update the category locally
    updatedTransactions[globalIndex].category = newCategory;
    setSemesterData(updatedTransactions);
  
    // Call the API to update the category
    updateTransactionCategory(transactionId, newCategory);
  };
  

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const updateTransactionCategory = async (transactionId, newCategory) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update transaction category");
      }
  
      console.log(`Transaction ${transactionId} updated to category: ${newCategory}`);
    } catch (error) {
      console.error("Error updating transaction category:", error);
    }
  };
  

  return (
    <Pane>
        {/* Pagination Controls */}
        <Pane display="flex" justifyContent="space-between" marginTop={16}>
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{
            backgroundColor: dynamicStyles.buttonBackgroundColor,
            color: dynamicStyles.buttonTextColor,
          }}
        >
          Previous
        </Button>
        <Pane alignSelf="center" style={{ color: dynamicStyles.textColor }}>
          Page {currentPage} of {totalPages}
        </Pane>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: dynamicStyles.buttonBackgroundColor,
            color: dynamicStyles.buttonTextColor,
          }}
        >
          Next
        </Button>
      </Pane>
      <Table
        marginTop={16}
        style={{
          backgroundColor: dynamicStyles.backgroundColor,
          color: dynamicStyles.textColor,
        }}
      >
        <Table.Head
          style={{
            backgroundColor: dynamicStyles.headerBackgroundColor,
            borderColor: dynamicStyles.borderColor,
          }}
        >
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Payer
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Time
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Message
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Amount
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Category
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {getCurrentPageTransactions().map((txn, index) => (
            <Table.Row
              key={index}
              style={{
                backgroundColor: dynamicStyles.backgroundColor,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor,
              }}
            >
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                {txn.payer}
              </Table.TextCell>
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                {txn.time}
              </Table.TextCell>
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                {txn.message}
              </Table.TextCell>
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                ${txn.amount}
              </Table.TextCell>
              <Table.TextCell>
                <SelectMenu
                  title="Edit Category"
                  options={categories.map((cat) => ({
                    label: cat,
                    value: cat,
                  }))}
                  selected={txn.category}
                  onSelect={(item) => handleCategoryChange(index, item.value)}
                >
                  <Button
                    style={{
                      backgroundColor: dynamicStyles.buttonBackgroundColor,
                      color: dynamicStyles.buttonTextColor,
                    }}
                  >
                    {txn.category}
                  </Button>
                </SelectMenu>
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default TransactionsTable;
