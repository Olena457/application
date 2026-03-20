import { Box, Paper, Typography } from "@mui/material";
import assistantImg from "../assets/assistant.png";
export const AiCardHelper = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: "20px" },
        background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: 5, sm: 8 },
          right: { xs: 5, sm: 6, lg: 10 },
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(8px)",
          px: 1,
          py: 0.5,
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: 900,
            fontSize: { xs: "0.7rem", sm: "0.9rem" },
            letterSpacing: "1px",
          }}
        >
          AI
        </Typography>
      </Box>

      <Box
        component="img"
        src={assistantImg}
        alt="AI Assistant"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.8,
          display: "block",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(to top, rgba(51, 8, 103, 0.5), transparent)",
          zIndex: 1,
        }}
      />
    </Paper>
  );
};
