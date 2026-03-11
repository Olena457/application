import {
  Box,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { ToolbarProps } from "react-big-calendar";

// --- Кастомна Подія (Event) ---
export const CustomEvent = ({ event }: any) => (
  <Box sx={{ display: "flex", flexDirection: "column", py: 0.5 }}>
    <Typography
      sx={{
        fontSize: "0.75rem",
        color: "#6366f1",
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      {format(new Date(event.start), "HH:mm")} - {event.title}
    </Typography>
  </Box>
);

export const CustomToolbar = (props: ToolbarProps) => {
  const { label, onView, onNavigate, view } = props;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={() => onNavigate("PREV")}
          sx={{ border: "1px solid #f3f4f6" }}
        >
          <ChevronLeft size={20} />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, minWidth: 150, textAlign: "center" }}
        >
          {label}
        </Typography>

        <IconButton
          onClick={() => onNavigate("NEXT")}
          sx={{ border: "1px solid #f3f4f6" }}
        >
          <ChevronRight size={20} />
        </IconButton>

        <Button
          variant="outlined"
          onClick={() => onNavigate("TODAY")}
          sx={{
            ml: 1,
            textTransform: "none",
            color: "#6b7280",
            borderColor: "#e5e7eb",
          }}
        >
          Today
        </Button>
      </Box>

      {/*  (Month / Week) */}
      <ButtonGroup variant="outlined" sx={{ backgroundColor: "#f9fafb" }}>
        <Button
          onClick={() => onView("month")}
          sx={{
            textTransform: "none",
            px: 3,
            backgroundColor: view === "month" ? "#6366f1" : "transparent",
            color: view === "month" ? "#fff" : "#6b7280",
            "&:hover": {
              backgroundColor: view === "month" ? "#4f46e5" : "#f3f4f6",
            },
          }}
        >
          Month
        </Button>
        <Button
          onClick={() => onView("week")}
          sx={{
            textTransform: "none",
            px: 3,
            backgroundColor: view === "week" ? "#6366f1" : "transparent",
            color: view === "week" ? "#fff" : "#6b7280",
            "&:hover": {
              backgroundColor: view === "week" ? "#4f46e5" : "#f3f4f6",
            },
          }}
        >
          Week
        </Button>
      </ButtonGroup>
    </Box>
  );
};
