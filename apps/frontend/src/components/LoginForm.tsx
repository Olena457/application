import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Alert,
} from "@mui/material";

const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  apiError: string | null;
}

export const LoginForm = ({
  onSubmit,
  isLoading,
  apiError,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: { email: "", password: "" },
  });

  const handleFormSubmit: SubmitHandler<LoginFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      sx={{
        width: "100%",
        maxWidth: 490,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <TextField
        {...register("email")}
        label="Email"
        fullWidth
        margin="normal"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        autoFocus
        disabled={isLoading}
      />

      <TextField
        {...register("password")}
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isLoading}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {apiError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {apiError}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{
          flex: 1,
          textTransform: "none",
          mt: 3,
          mb: 2,
          py: 1.5,
          fontWeight: 600,
          borderRadius: { xs: "8px", md: "10px" },
          backgroundImage:
            "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)",
          backgroundColor: "transparent",
          color: "white",
          border: "none",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",

          "&:hover": {
            backgroundImage:
              "linear-gradient(to bottom, #0d47a1 0%, #1e88e5 100%)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },

          "&:focus": { outline: "none" },
        }}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </Box>
  );
};
