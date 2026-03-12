// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Button, Container, Typography } from '@mui/material';
// import { logout } from '../store/slices/authSlice';
// import type { RootState } from '../store';

// export default function HomePage() {
//   const dispatch = useDispatch();
//   const user = useSelector((state: RootState) => state.auth.user);

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ py: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Hello, {user?.name || user?.email}!
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//           You are successfully signed in.
//         </Typography>
//         <Button variant="outlined" onClick={handleLogout}>
//           Sign Out
//         </Button>
//       </Box>
//     </Container>
//   );
// }
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';
import bgImage from '../assets/home-bg.png'; 

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.3), rgba(25, 118, 210, 0.2)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 24%",
        display: "flex",
        alignItems: "center",
        borderRadius: "16px",
        overflow: "hidden",
        mt: 0,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px",
            maxWidth: "500px",
          }}
        >
          <Typography
            variant="h4"
            component="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Welcome, {user?.name?.split(" ")[0] || "Friend"}!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Ready to discover or create amazing events? You are successfully
            signed in.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => (window.location.href = "/events")}
              sx={{ textTransform: "none" }}
            >
              Explore Events
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{ textTransform: "none" }}
            >
              Sign Out
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}