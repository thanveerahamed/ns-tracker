import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";

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
      <Button variant="contained">Primary</Button>
      <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
        Secondary
      </Button>
    </ThemeProvider>
  );
}

export default App;
