import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Typography } from '@mui/material';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Привіт, {user?.name || user?.email}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Ви успішно авторизовані.
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Вийти
        </Button>
      </Box>
    </Container>
  );
}
