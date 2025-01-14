import React, { useState } from "react";
import { Table, Button, Pane, Heading } from "evergreen-ui"; // Updated import for Heading
import { useTheme } from "../App"; // Import ThemeContext

const Reimbursements = () => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic styles based on the theme
  const dynamicStyles = {
    textColor: theme === "light" ? "#000000" : "#ffffff",
    backgroundColor: theme === "light" ? "#ffffff" : "#121212",
    headerBackgroundColor: theme === "light" ? "#f9f9f9" : "#2e2e2e",
    borderColor: theme === "light" ? "#e4e7eb" : "#444444",
    buttonBackgroundColor: theme === "light" ? "#007bff" : "#673ab7", // Dark green for dark mode
    buttonTextColor: theme === "light" ? "#ffffff" : "#e0e0e0",
  };

  // Sample data for reimbursement requests
  const [reimbursements, setReimbursements] = useState([
    {
      date: "2025-01-10",
      requester: "John Doe",
      amount: 150,
      reason: "Event Supplies",
    },
    {
      date: "2025-01-12",
      requester: "Jane Smith",
      amount: 75,
      reason: "Transportation",
    },
    {
      date: "2025-01-15",
      requester: "Emma Johnson",
      amount: 200,
      reason: "Equipment Rental",
    },
  ]);

  const handleApprove = (index) => {
    const updatedReimbursements = [...reimbursements];
    updatedReimbursements.splice(index, 1); // Remove the approved request
    setReimbursements(updatedReimbursements);
    alert("Reimbursement approved.");
  };

  const handleDeny = (index) => {
    const updatedReimbursements = [...reimbursements];
    updatedReimbursements.splice(index, 1); // Remove the denied request
    setReimbursements(updatedReimbursements);
    alert("Reimbursement denied.");
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
        Reimbursements
      </Heading>
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
            Date
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Requester
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Amount
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Reason
          </Table.TextHeaderCell>
          <Table.TextHeaderCell style={{ color: dynamicStyles.textColor }}>
            Actions
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {reimbursements.map((request, index) => (
            <Table.Row
              key={index}
              style={{
                backgroundColor: dynamicStyles.backgroundColor,
                color: dynamicStyles.textColor,
                borderColor: dynamicStyles.borderColor,
              }}
            >
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                {request.date}
              </Table.TextCell>
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                {request.requester}
              </Table.TextCell>
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                ${request.amount}
              </Table.TextCell>
              <Table.TextCell style={{ color: dynamicStyles.textColor }}>
                {request.reason}
              </Table.TextCell>
              <Table.TextCell>
                <Button
                  appearance="primary"
                  style={{
                    backgroundColor: dynamicStyles.buttonBackgroundColor,
                    color: dynamicStyles.buttonTextColor,
                    marginRight: 8,
                  }}
                  onClick={() => handleApprove(index)}
                >
                  Approve
                </Button>
                <Button
                  appearance="default"
                  intent="danger"
                  style={{
                    marginLeft: 8,
                  }}
                  onClick={() => handleDeny(index)}
                >
                  Deny
                </Button>
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default Reimbursements;
