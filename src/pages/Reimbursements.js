import React, { useState, useEffect } from "react";
import { Table, Button, Pane, Heading } from "evergreen-ui"; // Updated import for Heading
import { useTheme } from "../App"; // Import ThemeContext

const API_BASE_URL = "http://localhost:3000/";
const Reimbursements = () => {
  const { theme } = useTheme(); // Access the current theme

  // Define dynamic styles based on the theme
  const dynamicStyles = {
    textColor: theme === "light" ? "#000000" : "#F3EEED",
    backgroundColor: theme === "light" ? "#ffffff" : "#282828",
    headerBackgroundColor: theme === "light" ? "#f9f9f9" : "#282828",
    borderColor: theme === "light" ? "#e4e7eb" : "#F3EEED",
    buttonBackgroundColor: theme === "light" ? "#007bff" : "#355E3B", // Dark green for dark mode
    buttonTextColor: theme === "light" ? "#ffffff" : "#F3EEED",
  };

  const [reimbursements, setReimbursements] = useState([]);

  const fetchReimbursements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reimbursements`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setReimbursements(data);
    } catch (error) {
      console.error("Error fetching reimbursements:", error);
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reimbursements/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setReimbursements(reimbursements.filter((r) => r.id !== id));
    } catch (error) {
      console.error(`Error ${action} reimbursement:`, error);
    }
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
          {reimbursements.map((request) => (
            <Table.Row
              key={request.id}
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
                  onClick={() => handleAction(request.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  appearance="default"
                  intent="danger"
                  style={{
                    marginLeft: 8,
                  }}
                  onClick={() => handleAction(request.id, "denied")}
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
