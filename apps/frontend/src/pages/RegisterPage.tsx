
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { useRegisterMutation } from '../store/api/authApi';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterFormData } from "../components/RegisterForm";

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
      navigate('/events', { replace: true });
    } catch (err) {
      console.error("Catch block:", err);
    }
  };

  const apiErrorMessage =
    error && 'data' in error && error.data
      ? (error.data as any).message?.toString() || "Registration failed"
      : null;

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: '16px' }}>
          <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
            Create Account
          </Typography>
          
          <RegisterForm 
            onSubmit={handleOnSubmit} 
            isLoading={isLoading} 
            apiError={apiErrorMessage} 
          />

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
