import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import globLogo from "../assets/glob.svg";

export const Logo = () => (
  <Typography
    component={Link}
    to="/home"
    variant="h6"
    sx={{
      textDecoration: "none",
      color: "white",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "opacity 0.2s",
      "&:hover": { opacity: 0.8 },
    }}
  >
    <Box
      component="img"
      src={globLogo}
      alt="Logo"
      sx={{ height: { xs: 24, sm: 28 } }}
    />
    <Box component="span">Event Platform</Box>
  </Typography>
);
