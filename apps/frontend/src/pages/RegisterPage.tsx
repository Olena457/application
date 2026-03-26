
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useRegisterMutation } from "../store/api/authApi";
import { RegisterForm } from "../components/RegisterForm";
import type { RegisterFormData } from "../utils/auth.validation";
import homeBg from "../assets/home-bg.png";

const DEEP_OCEAN: [string, string] = ["#1A2980", "#1eb4ea"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const handleOnSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name || undefined,
      }).unwrap();
      navigate("/events", { replace: true });
    } catch (err) {
      console.error("Catch block:", err);
    }
  };

  const apiErrorMessage =
    error && "data" in error && error.data
      ? (error.data as any).message?.toString() || "Registration failed"
      : null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 0, md: 4 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: "550px",
              borderRadius: "16px",
              boxShadow: "0px 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                display: "inline-block",
                width: "fit-content",
                mb: 4,
                fontWeight: 600,
                fontSize: {
                  xs: "1.75rem", 
                  sm: "2.125rem", 
                },
                background: `linear-gradient(135deg, ${DEEP_OCEAN[0]} 10%, ${DEEP_OCEAN[1]} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Account
            </Typography>

            <RegisterForm
              onSubmit={handleOnSubmit}
              isLoading={isLoading}
              apiError={apiErrorMessage}
            />

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: DEEP_OCEAN[0],
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: "100%",
          maxWidth: "600px",
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </Box>
  );
}
