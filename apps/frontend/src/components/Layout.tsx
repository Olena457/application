

import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import globLogo from "../assets/glob.svg";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { List, Calendar, Plus, User, LogOut } from "lucide-react";
import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const formatUserName = (name: string | undefined | null) => {
    if (!name) return "Guest";
    return name.length > 6 ? `${name.substring(0, 6)}...` : name;
  };

  const isActive = (path: string) => location.pathname === path;

  const navButtonStyle = (path: string) => ({
    textTransform: "none",
    fontSize: { xs: "0.7rem", sm: "0.9rem" },
    display: "flex",
    alignItems: "center",
    gap: { xs: "2px", sm: "4px" },
    mx: { xs: 0.1, sm: 0.2 },
    px: { xs: 0.8, sm: 1.5 },
    borderRadius: "8px",
    color: "white",
    backgroundColor: isActive(path)
      ? "rgba(255, 255, 255, 0.25)"
      : "transparent",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#42a5f5",
      color: "white",
    },
    "& .MuiButton-startIcon": {
      display: { xs: "none", sm: "inline-flex" },
      marginRight: { xs: 0, sm: "8px" },
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#1976d2", boxShadow: "none" }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 0.7, sm: 2 },
            minHeight: { xs: "56px", sm: "64px" },

          }}
          
        >
          <Typography
            component={Link}
            to="/home"
            variant="h6"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              mr: { xs: 1, sm: 2 },
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "#42A5F5",
              },
            }}
          >
            <Box
              component="img"
              src={globLogo}
              alt="Logo"
              sx={{
                height: { xs: 20, sm: 28 },
                width: "auto",
              }}
            />
            <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
              Event Platform
            </Box>
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.2, sm: 0.5 },
            }}
          >
            <Button
              sx={navButtonStyle("/events")}
              component={Link}
              to="/events"
              startIcon={<List size={18} />}
            >
              Events
            </Button>

            {token ? (
              <>
                <Button
                  sx={navButtonStyle("/my-events")}
                  component={Link}
                  to="/my-events"
                  startIcon={<Calendar size={18} />}
                >
                  My Events
                </Button>

                <Button
                  sx={navButtonStyle("/events/create")}
                  component={Link}
                  to="/events/create"
                  startIcon={<Plus size={18} />}
                >
                  Create
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: { xs: 0.5, sm: 1.5 },
                    gap: "6px",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      display: { xs: "none", sm: "flex" },
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={16} color="white" />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: { xs: "0.7rem", sm: "0.85rem" },
                    }}
                  >
                    {formatUserName(user?.name || user?.email)}
                  </Typography>
                </Box>

                <Tooltip title="Sign Out">
                  <IconButton
                    onClick={handleLogout}
                    sx={{ color: "white", p: { xs: 0.5, sm: 1 } }}
                  >
                    <LogOut size={18} />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button
                sx={navButtonStyle("/login")}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
