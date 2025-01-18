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
      height="100vh" // Full height of the viewport
      width={250}
      borderRight
      position="fixed" // Make the sidebar fixed
      top={0} // Align to the top of the viewport
      left={0} // Align to the left of the viewport
      zIndex={1000} // Ensure it appears above other content
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
            CYUN v0.0.1
          </Text>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default Sidebar;
