import { Box } from "@mui/material";

export const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed", 
        top: 0,
        left: 0,
        width: "100vw", 
        height: "100vh", 
        zIndex: 9999, 
        backgroundColor: "#f8f9fa", 
      }}
    >
      <Box
        className="loader"
        sx={{
          width: "30px",
          aspectRatio: "1",
          display: "grid",
          transform: "translateY(100%)",
          "&::before, &::after": {
            content: '""',
            gridArea: "1/1",
            borderRadius: "50%",
            transformOrigin: "bottom",
            position: "relative",
          },
          "&::before": {
            background: "radial-gradient(at 30% 30%, #54a5ff, #001980)",
            transform: "scaleY(0.65)",
            top: 0,
            animation:
              "l11-1 2s cubic-bezier(0,400,1,400) infinite, l11-2 2s ease infinite",
          },
          "&::after": {
            background: "#ccc",
            filter: "blur(8px)",
            transform: "scaleY(0.3) translate(0px, 0px)",
            left: 0,
            animation: "l11-3 2s cubic-bezier(0,400,1,400) infinite",
          },
          "@keyframes l11-1": {
            "100%": { top: "-0.2px" },
          },
          "@keyframes l11-2": {
            "4%, 96%": { transform: "scaleY(1)" },
          },
          "@keyframes l11-3": {
            "100%": { transform: "scaleY(0.3) translate(0.1px, -0.1px)" },
          },
        }}
      />
    </Box>
  );
};
