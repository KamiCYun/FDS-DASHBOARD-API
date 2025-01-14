import React from "react";
import { Pane, Button, Text, Switch } from "evergreen-ui";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../App"; // Import theme context

function Sidebar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Toggle the theme state
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      background={theme === "light" ? "#f9f9f9" : "#121212"}
      padding={16}
      height="100vh"
      width={250}
      borderRight
    >
      {/* Top section with menu buttons */}
      <Pane>
        <Button
          className={theme === "light" ? "button-light" : "button-dark"}
          justifyContent="flex-start"
          width="100%"
          marginBottom={12}
          onClick={() => navigate("/")}
        >
          Financials
        </Button>
        <Button
          className={theme === "light" ? "button-light" : "button-dark"}
          justifyContent="flex-start"
          width="100%"
          marginBottom={12}
          onClick={() => navigate("/reimbursements")}
        >
          Reimbursements
        </Button>
        <Button
          className={theme === "light" ? "button-light" : "button-dark"}
          justifyContent="flex-start"
          width="100%"
          marginBottom={12}
          onClick={() => navigate("/dues")}
        >
          Dues
        </Button>
      </Pane>

      {/* Footer section */}
      <Pane>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={16}
        >
          <Text size={300} color={theme === "light" ? "muted" : "#b39ddb"}>
            Dark Mode
          </Text>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            height={20}
          />
        </Pane>
        <Pane display="flex" alignItems="center" justifyContent="center">
          <Text size={300} color={theme === "light" ? "muted" : "#b39ddb"}>
            164 v0.0.1
          </Text>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default Sidebar;
