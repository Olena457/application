
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store";
import bgImage from "../assets/home-bg.png";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.3), rgba(25, 118, 210, 0.2)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 24%",
        display: "flex",
        alignItems: "center",
        borderRadius: "16px",
        overflow: "hidden",
        mt: 0,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px",
            maxWidth: "500px",
          }}
        >
          <Typography
            variant="h4" 
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            {user
              ? `Welcome, ${user.name?.split(" ")[0]}!`
              : "Welcome to Event Platform!"}
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {user
              ? "Ready to discover or create amazing events? You are successfully signed in."
              : "Login to your account to join exciting events and manage your own schedule."}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/events")}
              sx={{ textTransform: "none" }}
            >
              Explore Events
            </Button>

            {user ? (
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{ textTransform: "none" }}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none" }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}