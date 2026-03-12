
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useLoginMutation } from "../store/api/authApi";
import { LoginForm } from "../components/LoginForm";
import type { LoginFormData } from "../components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleOnSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const apiErrorMessage =
    error && "data" in error && error.data && typeof error.data === "object"
      ? (error.data as any).message
        ? Array.isArray((error.data as any).message)
          ? (error.data as any).message.join(", ")
          : (error.data as any).message.toString()
        : "Invalid email or password"
      : null;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            fontWeight={700}
          >
            Sign In
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Welcome back! Please enter your details.
          </Typography>

          <LoginForm
            onSubmit={handleOnSubmit}
            isLoading={isLoading}
            apiError={apiErrorMessage}
          />

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
