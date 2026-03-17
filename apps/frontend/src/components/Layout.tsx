// 
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { navButtonStyle, isActive } = useNavStyles();

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const displayName = user?.name || user?.email || "Guest";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#1976d2", boxShadow: "none" }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, sm: 5 },
            minHeight: { xs: "56px", sm: "64px" },
          }}
        >
          <Logo />

          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              sx={{ display: { sm: "none" }, ml: 1, color: "white" }}
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

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}