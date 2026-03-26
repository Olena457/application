import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Box, Container, Toolbar, IconButton } from "@mui/material";
import { Menu } from "lucide-react";


import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store";

import { Logo } from "../components/Logo";
import { DesktopNav } from "../components/DesktopNav";
import { MobileMenu } from "../components/MobileMenu";
import { useNavStyles } from "../hooks/useNavStyles";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { navButtonStyle, isActive } = useNavStyles();

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const displayName = user?.name || user?.email || "Guest";
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundImage: isHomePage
            ? "none"
            : "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)",
          backgroundColor: isHomePage ? "transparent" : "#0d47a1",
          color: "white",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: isHomePage ? "none" : "0px 2px 10px rgba(0,0,0,0.1)",
          paddingTop: "8px",
          paddingBottom: "8px",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 3, sm: 5 },
            minHeight: { xs: "56px", sm: "64px" },
          }}
        >
          <Logo />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <DesktopNav
              token={token}
              userName={displayName}
              isActive={isActive}
              navButtonStyle={navButtonStyle}
              handleLogout={handleLogout}
            />

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { sm: "none" },
                ml: 1,
                color: isHomePage ? "#57a8ef" : "white",
                visibility: mobileOpen ? "hidden" : "visible",
                transition: "visibility 0.3s",
                
              }}
            >
              <Menu size={28} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        token={token}
        userName={displayName}
        handleLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          overflow: isHomePage ? "hidden" : "visible",
          mt: isHomePage ? 0 : { xs: 11, lg: 12 },
          width: "100%",
          height: isHomePage ? "100vh" : "auto",
        }}
      >
        {isHomePage ? (
          <Outlet />
        ) : (
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        )}
      </Box>
    </Box>
  );
}
