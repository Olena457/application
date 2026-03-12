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
          sx={{ py: 1.5, px: 4, borderRadius: "8px" }}
        >
          Back to Events
        </Button>
      </Box>
    </Container>
  );
}
