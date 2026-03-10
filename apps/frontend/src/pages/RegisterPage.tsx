import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useRegisterMutation } from '../store/api/authApi';

const registerSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(6, 'Пароль має бути мінімум 6 символів'),
  name: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
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
            Реєстрація
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
              label="Ім'я (необов'язково)"
              fullWidth
              margin="normal"
              autoComplete="name"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('password')}
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {Array.isArray((error as { data?: { message?: unknown } }).data?.message)
                  ? (error as { data: { message: string[] } }).data.message.join(', ')
                  : (error as { data?: { message?: string } }).data?.message ||
                    'Помилка реєстрації'}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Завантаження...' : 'Зареєструватися'}
            </Button>

            <Typography variant="body2" align="center">
              Вже є акаунт?{' '}
              <Link to="/login" style={{ color: 'inherit' }}>
                Увійти
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
