
import { Box, Button, Typography, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { List, Calendar, Plus, User, LogOut } from "lucide-react";

interface DesktopNavProps {
  token: string | null;
  userName: string;
  isActive: (path: string) => boolean;
  navButtonStyle: (path: string) => object;
  handleLogout: () => void;
}
export const DesktopNav = ({
  token,
  userName,
  navButtonStyle,
  handleLogout,
}: DesktopNavProps) => {
  const formattedName =
    userName.length > 6 ? `${userName.substring(0, 6)}...` : userName;

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        gap: 0.5,
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

          <Tooltip title={userName}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 1.5,
                mr: 1,
                gap: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <User size={16} color="white" />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                }}
              >
                {formattedName}
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Sign Out">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "white",
                p: 1,
              }}
            >
              <LogOut size={18} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Button sx={navButtonStyle("/login")} component={Link} to="/login">
          Login
        </Button>
      )}
    </Box>
  );
};