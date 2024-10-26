"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "../../theme/darkTheme";
import { GlobalStyles } from "@mui/material";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          input: {
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px #121212 inset",
              WebkitTextFillColor: "#fff",
            },
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
}
