
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
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "4px", 
    mx: 0.2,
    px: 1.5,
    borderRadius: "8px",
    color: "white",
    backgroundColor: isActive(path)
      ? "rgba(255, 255, 255, 0.15)"
      : "transparent",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "#42a5f5",
      color: "white",
    },
    "& .MuiButton-startIcon": {
      color: "inherit",
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#1976d2", boxShadow: "none" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            component={Link}
            to="/home"
            variant="h6"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              mr: 2,
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
                height: 24, 
                width: "auto",
              }}
            />
            Event Platform
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
                  Create Event
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: 1.5,
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={18} color="white" />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {formatUserName(user?.name || user?.email)}
                  </Typography>
                </Box>

                <Tooltip title="Sign Out">
                  <IconButton
                    onClick={handleLogout}
                    sx={{
                      color: "white",
                      ml: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                    size="small"
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
                startIcon={<User size={18} />}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}