import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" fontWeight={700} color="primary">
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Oops! The page you are looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/events")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: { xs: "8px", md: "10px" },
            py: 1.5,
            px: 4,
            backgroundImage:
              "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",

            "&:hover": {
              backgroundImage:
                "linear-gradient(to bottom, #0d47a1 0%, #1e88e5 100%)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },

            "&:focus": { outline: "none" },
          }}
        >
          Back to Events
        </Button>
      </Box>
    </Container>
  );
}
