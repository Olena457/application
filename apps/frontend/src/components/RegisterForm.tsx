
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

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[a-zA-Za-яА-ЯіІїЇєЄґҐ' ]+$/;

const registerSchema = yup
  .object({
    email: yup
      .string()
      .matches(emailRegex, "Please enter a valid email address")
      .required("Email is required"),
    name: yup
      .string()
      .max(50, "Name is too long")
      .matches(nameRegex, "Name must contain only letters")
      .optional()
      .default(""),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must include uppercase, lowercase, number and special character",
      )
      .required("Password is required"),
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
        label="Name (optionally: surname)"
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
        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </Box>
  );
};