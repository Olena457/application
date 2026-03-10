import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Event Platform
          </Typography>
          <Button color="inherit" component={Link} to="/events">
            Events
          </Button>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/my-events">
                My Events
              </Button>
              <Button color="inherit" component={Link} to="/events/create">
                Create Event
              </Button>
              <Typography variant="body2" sx={{ mx: 1 }}>
                {user?.name || user?.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
