import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  List as ListIcon,
  Calendar,
  Plus,
  User,
  LogOut,
  X,
} from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  token: string | null;
  userName: string;
  handleLogout: () => void;
}

export const MobileMenu = ({
  open,
  onClose,
  token,
  userName,
  handleLogout,
}: MobileMenuProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
    const isHomePage = location.pathname === "/" || location.pathname === "/home";


  const menuItems = [
    { text: "Events", path: "/events", icon: <ListIcon size={20} /> },
    ...(token
      ? [
          {
            text: "My Events",
            path: "/my-events",
            icon: <Calendar size={20} />,
          },
          { text: "Create", path: "/events/create", icon: <Plus size={20} /> },
        ]
      : []),
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": {
          width: 280,
          backgroundColor: "#f8f9fa",
        },
      }}
    >
      <Box
        sx={{
          width: 280,
          height: "100%",
          position: "relative",
          pt: 1,
          backgroundColor: "#f8f9fa",
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: "flex",
            mt: 2,
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 10 }}>
            <User size={20} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {userName}
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: isHomePage ? "#57a8ef" : "#000" }}
          >
            <X size={24} />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onClose}
                selected={isActive(item.path)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(25, 118, 210, 0.12)",
                    borderRight: "4px solid #1976d2",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? "primary.main" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {!token && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login" onClick={onClose}>
                <ListItemText primary="Login" sx={{ pl: 5 }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        {token && (
          <Box sx={{ position: "absolute", bottom: 0, width: "100%", pb: 2 }}>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                  sx={{ color: "error.main" }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
                    <LogOut size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
