import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeroContentProps {
  userName?: string | null;
  onLogout: () => void;
}

export const HeroContent = ({ userName, onLogout }: HeroContentProps) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={6}
      sx={{
        p: { xs: 3, sm: 4 },
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: "24px",
        maxWidth: "520px",
        width: "100%",
        backdropFilter: "blur(4px)",
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
        {userName
          ? `Welcome back, ${userName.split(" ")[0]}!`
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
        {userName
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
          }}
        >
          Explore Events
        </Button>

        {userName ? (
          <Button
            variant="outlined"
            size="large"
            onClick={onLogout}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
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
              borderWidth: "2px",
              px: 4,
              "&:hover": { borderWidth: "2px" },
            }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Paper>
  );
};
