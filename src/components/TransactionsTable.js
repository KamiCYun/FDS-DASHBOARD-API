import React from "react";
import { Table, SelectMenu, Button } from "evergreen-ui";
import { useTheme } from "../App"; // Import ThemeContext

const TransactionsTable = ({ transactions, categories, setSemesterData }) => {
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

  const handleCategoryChange = (index, newCategory) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index].category = newCategory;
    setSemesterData(updatedTransactions);
  };

  return (
    <Table marginTop={16} style={{ backgroundColor: dynamicStyles.backgroundColor, color: dynamicStyles.textColor }}>
      <Table.Head style={{ backgroundColor: dynamicStyles.headerBackgroundColor, borderColor: dynamicStyles.borderColor }}>
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
        {transactions.map((txn, index) => (
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
  );
};

export default TransactionsTable;
