
import { useNavigate } from "react-router-dom";
import { format, isSameDay, startOfWeek, addDays } from "date-fns";
import { Box, Typography, Paper, Stack } from "@mui/material";

interface WeeklyViewProps {
  currentDate: Date;
  events: any[];
}

export const WeeklyCalendarView = ({
  currentDate,
  events,
}: WeeklyViewProps) => {
  const navigate = useNavigate();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i),
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(3, minmax(0, 1fr))",
          md: "repeat(7, minmax(0, 1fr))",
        },
        gap: 2,
        width: "100%",
        overflowX: "auto",
        pb: 1,
      }}
    >
      {weekDays.map((day) => {
        const dayEvents =
          events?.filter((e) => isSameDay(new Date(e.date), day)) || [];
        const isToday = isSameDay(day, new Date());

        return (
          <Paper
            key={day.toString()}
            elevation={0}
            sx={{
              p: 2,
              minHeight: "200px",
              height: "100%",
              borderRadius: "16px",
              border: isToday ? "2px solid #60a5ea" : "1px solid #e5e7eb",
              backgroundColor: "#fff",
            }}
          >
            {/* day name */}
            <Typography
              sx={{
                color: "#111827",
                fontSize: "0.85rem",
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {format(day, "eee")}
            </Typography>

            {/* day number */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                mb: 2,
                color: isToday ? "#6366f1" : "#6b7280",
              }}
            >
              {format(day, "d")}
            </Typography>

            <Stack spacing={1}>
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <Box
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    sx={{
                      backgroundColor: "#EAF6FF",
                      color: "#1976d2",
                      fontSize: "14px",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      border: "1px solid #dbeafe",
                      width: "100%",
                      minWidth: 0,
                      overflow: "hidden",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#dbeafe",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#1976d2",
                        fontWeight: 600,
                        lineHeight: 1.4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {/* format date */}
                      {format(new Date(event.date), "HH:mm")} - {event.title}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{ color: "#9ca3af", fontSize: "0.8rem", mt: 0.5 }}
                >
                  No events
                </Typography>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};