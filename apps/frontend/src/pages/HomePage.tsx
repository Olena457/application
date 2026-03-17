import { useDispatch, useSelector } from "react-redux";
import { Box, Container } from "@mui/material";
import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store";
import bgImage from "../assets/home-bg.png";
import { HeroContent } from "../components/HeroContent";

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: {
          xs: "calc(100vh - 72px)", 
          sm: "calc(100vh - 80px)", 
        },
        borderRadius: { xs: "12px", md: "24px" },
        backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.25), rgba(25, 118, 210, 0.2)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
          px: { xs: 2, md: 6 },
        }}
      >
        <HeroContent userName={user?.name} onLogout={handleLogout} />
      </Container>
    </Box>
  );
}
