import { defaultTheme } from "evergreen-ui";

const customTheme = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    Button: {
      ...defaultTheme.components.Button,
      appearances: {
        ...defaultTheme.components.Button.appearances,
        custom: {
          backgroundColor: "#006400", // Dark green
          color: "#FFC0CB", // Pink text
          border: "none",
          _hover: {
            backgroundColor: "#004d00", // Slightly darker green on hover
          },
        },
      },
    },
  },
};

export default customTheme;
