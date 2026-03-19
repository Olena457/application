import { Box, Button } from "@mui/material";

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
  submitLabel: string;
}

const baseButtonStyle = {
  flex: 1,
  maxWidth: "250px",
  borderRadius: "10px",
  textTransform: "none",
  py: 1,
  fontWeight: 600,
  fontSize: { xs: "0.875rem", sm: "1rem" },
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  backgroundColor: "transparent",
  color: "white",
  border: "none",
  "&:focus": { outline: "none" },
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
};

const cancelButtonStyle = {
  ...baseButtonStyle,
  backgroundImage: "linear-gradient(to bottom, #E15B5B 0%, #C62828 100%)",
  "&:hover": {
    ...baseButtonStyle["&:hover"],
    backgroundImage: "linear-gradient(to bottom, #C62828 0%, #E15B5B 100%)",
  },
};

const submitButtonStyle = {
  ...baseButtonStyle,
  backgroundImage: "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)",
  "&:hover": {
    ...baseButtonStyle["&:hover"],
    backgroundImage: "linear-gradient(to bottom, #0d47a1 0%, #1e88e5 100%)",
  },
};

export const FormActions = ({
  isLoading,
  onCancel,
  submitLabel,
}: FormActionsProps) => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      mt: "auto",
      pt: { xs: 2, sm: 3 },
      pb: { xs: 2, sm: 3 },
      justifyContent: "center",
    }}
  >
    <Button
      variant="contained"
      onClick={onCancel}
      disabled={isLoading}
      sx={cancelButtonStyle}
    >
      Cancel
    </Button>
    <Button
      type="submit"
      variant="contained"
      disabled={isLoading}
      sx={submitButtonStyle}
    >
      {isLoading ? "Processing..." : submitLabel}
    </Button>
  </Box>
);
