import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material/Button";

interface GradientButtonProps extends ButtonProps {
  colors: [string, string];
}

export const GradientButton = ({
  colors,
  sx,
  ...props
}: GradientButtonProps) => (
  <Button
    size="small"
    variant="contained"
    {...props}
    sx={{
      flex: 1,
      textTransform: "none",
      fontWeight: 600,
      borderRadius: { xs: "8px", md: "10px" },
      backgroundImage: `linear-gradient(to bottom, ${colors[0]} 0%, ${colors[1]} 100%)`,
      backgroundColor: "transparent",
      color: "white",
      border: "none",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundImage: `linear-gradient(to bottom, ${colors[1]} 0%, ${colors[0]} 100%)`,
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      },
      "&:focus": { outline: "none" },
      ...sx,
    }}
  />
);
