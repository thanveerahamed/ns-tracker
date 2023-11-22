import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { Outlet } from "react-router-dom";
import Header from "./components/Header.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2b8257",
    },
    secondary: {
      main: "#F06418",
    },
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Outlet />
    </ThemeProvider>
  );
}

export default App;
