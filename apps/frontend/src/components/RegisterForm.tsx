import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../utils/auth.validation";

import type { RegisterFormData } from "../utils/auth.validation";

import { Eye, EyeOff } from "lucide-react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Alert,
} from "@mui/material";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  apiError: string | null;
}

export const RegisterForm = ({
  onSubmit,
  isLoading,
  apiError,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as any,
    defaultValues: { email: "", password: "", name: "" },
  });

  const handleFormSubmit: SubmitHandler<RegisterFormData> = (data) => {
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
        placeholder="example@mail.com"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isLoading}
      />

      <TextField
        {...register("name")}
        label="First name and surname"
        placeholder="Your name"
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isLoading}
      />

      <TextField
        {...register("password")}
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isLoading}
        InputProps={{
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
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </Box>
  );
};
