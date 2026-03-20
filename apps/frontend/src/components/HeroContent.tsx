import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HeroContentProps {
  userName?: string | null;
  onLogout: () => void;
}

export const HeroContent = ({ userName, onLogout }: HeroContentProps) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        width: "100%",
        justifyContent: { xs: "center", sm: "space-evenly", lg: "center" },
        py: { xs: 2, sm: 3, lg: 1.5 },
        px: { xs: 1.5, sm: 2 },
        position: "relative",
        overflow: "hidden",
        borderRadius: "32px",
        background: "linear-gradient(to left, #514a9d, #24c6dc)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 1,
          fontWeight: 800,
          color: "white",

          fontSize: { xs: "1.4rem", sm: "2rem", lg: "2.1rem" },
          lineHeight: 1.4,
        }}
      >
        {userName ? (
          <>
            Welcome back, <br /> {userName.split(" ")[0]}!
          </>
        ) : (
          <>
            Discover <br /> Amazing Events
          </>
        )}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 2.5,
          color: "rgba(255, 255, 255, 0.6)",
          maxWidth: "340px",
          fontWeight: 300,
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
          gap: 1.5,
          flexDirection: { xs: "column", sm: "column", md: "row" },
          alignItems: "center",
          mt: { sm: 4, lg: 0 },
        }}
      >
        <Button
          variant="contained"
          size="medium"
          onClick={() => navigate("/events")}
          endIcon={<ArrowRight size={16} />}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            fontWeight: 600,
            px: { xs: 1.2, sm: 2.5 },
            py: 1.8,
            background: "linear-gradient(360deg, #514a9d, #24c6dc)",

          }}
        >
          Explore Events
        </Button>

        {userName ? (
          <Button
            variant="outlined"
            size="small"
            onClick={onLogout}
            sx={{
              px: { xs: 1, sm: 2.5 },
              py: 1.8,
              textTransform: "none",
              borderRadius: "12px",
              borderColor: "rgba(255, 255, 255, 0.93)",
              color: "#fff",
            }}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="medium"
            onClick={() => navigate("/login")}
            sx={{
              px: { xs: 1, sm: 2.5 },
              py: 1.8,
              textTransform: "none",
              borderRadius: "12px",
              borderColor: "rgba(255, 255, 255, 0.93)",
              color: "#fff",
            }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Paper>
  );
};
