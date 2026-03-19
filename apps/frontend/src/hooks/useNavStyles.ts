import { useLocation } from "react-router-dom";

export const useNavStyles = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navButtonStyle = (path: string) => ({
    textTransform: "none" as const,
    fontSize: { sm: "0.85rem", md: "0.9rem" },
    display: "flex",
    alignItems: "center",
    borderRadius: { xs: "8px", md: "10px" },
    gap: "4px",
    mx: 0.2,
    px: 1.5,
    color: "white",
    backgroundColor: isActive(path)
      ? "rgba(255, 255, 255, 0.25)"
      : "transparent",
    transition: "all 0.2s ease",
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
  });

  return { isActive, navButtonStyle };
};
