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

const registerSchema = yup
  .object({
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    name: yup.string().optional().default(""),
  })
  .required();

export type RegisterFormData = yup.InferType<typeof registerSchema>;

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
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <TextField
        {...register("email")}
        label="Email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isLoading}
      />
      <TextField
        {...register("name")}
        label="Name (optional)"
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
        sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </Box>
  );
};
