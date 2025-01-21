import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, defaultTheme } from "evergreen-ui";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import Reimbursements from "./pages/Reimbursements";
import Dues from "./pages/Dues";
import "./App.css"; // Import global styles

// Create Theme Context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Define a custom Evergreen UI theme
const customTheme = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    Button: {
      ...defaultTheme.components.Button,
      appearances: {
        ...defaultTheme.components.Button.appearances,
        custom: {
          backgroundColor: "#006400", // Dark green background
          color: "#FFC0CB", // Pink text
          border: "none",
          _hover: {
            backgroundColor: "#004d00", // Slightly darker green on hover
          },
          _active: {
            backgroundColor: "#002800", // Even darker green on active
          },
        },
      },
    },
  },
};

function App() {
  const [theme, setTheme] = useState("light"); // Manage light/dark theme

  useEffect(() => {
    // Apply the theme class to the <body> element
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "light" ? "light-mode" : "dark-mode");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider value={customTheme}>
        <div className="app-container">
          <Router>
            {/* Main layout wrapper */}
            <div style={{ display: "flex", height: "100vh" }}>
              <Sidebar /> {/* Sidebar component */}
              {/* Main content wrapper */}
              <div
                style={{
                  flexGrow: 1,
                  marginLeft: "250px", // Add margin to match Sidebar width
                  overflowY: "auto", // Allow content to scroll
                  padding: "16px",
                }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/reimbursements" element={<Reimbursements />} />
                  <Route path="/dues" element={<Dues />} />
                </Routes>
              </div>
            </div>
          </Router>
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
