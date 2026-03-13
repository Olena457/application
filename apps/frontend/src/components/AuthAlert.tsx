import { Snackbar, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface AuthAlertProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: "warning" | "info" | "success" | "error";
  showLoginButton?: boolean;
}

export const AuthAlert = ({
  open,
  onClose,
  message,
  severity = "warning",
  showLoginButton = false,
}: AuthAlertProps) => {
  const navigate = useNavigate();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          backgroundColor: severity === "warning" ? "#ff6b6b" : undefined,
          color: severity === "warning" ? "#000" : "#fff",
          fontWeight: 600,
        }}
        action={
          showLoginButton ? (
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/login")}
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Login
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
