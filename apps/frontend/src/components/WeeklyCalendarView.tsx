

import { useNavigate } from "react-router-dom";
import { format, isSameDay, startOfWeek, addDays } from "date-fns";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { getTagStyle } from "../helpers/tagColors";

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
            elevation={1}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              p: 2,
              minHeight: "200px",
              height: "100%",
              border: isToday ? "2px solid #1976d2" : "1px solid #e5e7eb",
              boxShadow: isToday
                ? "0 4px 12px rgba(25, 118, 210, 0.2)"
                : "none",
            }}
          >
            <Typography
              sx={{
                color: isToday ? "#1976d2" : "#111827",
                fontSize: "0.85rem",
                fontWeight: 700,
                mb: 0.5,
                textTransform: "uppercase",
              }}
            >
              {format(day, "eee")}
            </Typography>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.25rem",
                mb: 2,
                color: isToday ? "#1976d2" : "#6b7280",
              }}
            >
              {format(day, "d")}
            </Typography>

            <Stack spacing={1}>
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => {
                  const { main, bg } = getTagStyle(event.tags?.[0]);

                  return (
                    <Box
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      sx={{
                        backgroundColor: bg,
                        color: main,
                        fontSize: "13px",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        borderLeft: `4px solid ${main}`,
                        width: "100%",
                        cursor: "pointer",
                        transition: "transform 0.1s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          filter: "brightness(0.95)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: "inherit",
                        }}
                      >
                        {format(new Date(event.date), "HH:mm")}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "inherit",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                        }}
                      >
                        {event.title}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Typography
                  sx={{
                    color: "#9ca3af",
                    fontSize: "0.75rem",
                    mt: 1,
                    fontStyle: "italic",
                  }}
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
