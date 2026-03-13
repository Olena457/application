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
        width: "100%",

        height: {
          xs: "calc(100vh - 56px - 16px)",
          sm: "calc(100vh - 64px - 16px)",
        },

        borderRadius: { xs: "12px", md: "24px" },
        mt: 0,

        backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.25), rgba(25, 118, 210, 0.2)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
        backgroundRepeat: "no-repeat",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
          px: { xs: 2, md: 6 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 4 },
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "24px",
            maxWidth: "520px",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              fontSize: { xs: "1.75rem", sm: "2.5rem" },
            }}
          >
            {user
              ? `Welcome back, ${user.name?.split(" ")[0]}!`
              : "Discover Amazing Events"}
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              lineHeight: 1.4,
            }}
          >
            {user
              ? "Ready to explore what's happening? Your next big experience is just a click away."
              : "Join our community to discover, create, and manage local events with ease."}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/events")}
              sx={{
                textTransform: "none",
                borderRadius: "12px",

                fontWeight: 600,
                px: { xs: 2, sm: 3.5 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                boxShadow: 1,
              }}
            >
              Explore Events
            </Button>

            {user ? (
              <Button
                variant="outlined"
                size="large"
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  px: { xs: 2, sm: 3.5 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  borderWidth: "2px",
                  "&:hover": { borderWidth: "2px" },
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  borderWidth: "2px",
                  "&:hover": { borderWidth: "2px" },
                }}
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