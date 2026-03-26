
import { useState, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { AnimatedDatabaseText } from "./AnimatedDatabaseText";

const colorShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledSkeleton = styled(Skeleton)({
  backgroundColor: "#f5f5f5",
  backgroundImage:
    "linear-gradient(270deg, #A7CEFB, #7FD2F3, #3B82F6, #7FD2F3, #A7CEFB)",
  backgroundSize: "400% 400%",
  animation: `${colorShift} 8s ease infinite`,
  "&::after": { display: "none" },
});

export const EventsSkeleton = ({ count = 8 }) => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlowMessage(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        mt: 4,
        position: "relative",
      }}
    >
      {showSlowMessage && (
        <Box
          sx={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2000,
            width: "90%",
            animation: "fadeIn 1s ease-out",
            pointerEvents: "none",
          }}
        >
          <AnimatedDatabaseText />
        </Box>
      )}

      {Array.from({ length: count }).map((_, i) => (
        <StyledSkeleton
          key={i}
          variant="rectangular"
          height={250}
          sx={{ flex: "1 1 300px", borderRadius: 4 }}
        />
      ))}
    </Box>
  );
};