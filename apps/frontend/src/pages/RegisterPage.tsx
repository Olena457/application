import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useRegisterMutation } from '../store/api/authApi';

const registerSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', name: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name || undefined,
      }).unwrap();
      navigate('/', { replace: true });
    } catch {
      // error handled by error state
    }
  };

  const apiErrorMessage =
    error && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
      ? Array.isArray((error.data as { message: unknown }).message)
        ? (error.data as { message: string[] }).message.join(', ')
        : (error.data as { message: string }).message
      : null;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoFocus
            />
            <TextField
              {...register('name')}
              label="Name (optional)"
              fullWidth
              margin="normal"
              autoComplete="name"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('password')}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {apiErrorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {apiErrorMessage}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign Up'}
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'inherit' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
