// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: { main: "#1976d2" },
//     secondary: { main: "#9c27b0" },
//   },
// });

// export default theme;
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1560,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1560px)": {
            maxWidth: "1560px !important",
          },
        },
      },
    },
  },
});

export default theme;