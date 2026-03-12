import { Box, CircularProgress } from "@mui/material";

export const PageLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        width: "100%",
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ color: "#1976d2" }} />
    </Box>
  );
};
