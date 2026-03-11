


import {  useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import { dateFnsLocalizer, Calendar, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetMyEventsQuery } from "../store/api/eventsApi";
import { WeeklyCalendarView } from "../components/WeeklyCalendarView"; 

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) => format(date, formatStr),
  parse: (value: string, formatStr: string, refDate: unknown) =>
    parse(value, formatStr, refDate instanceof Date ? refDate : new Date()),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const { data: events, isLoading } = useGetMyEventsQuery(undefined);

  const calendarEvents = useMemo(() => {
    if (!events) return [];
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      start: new Date(e.date),
      end: new Date(new Date(e.date).getTime() + 60 * 60 * 1000),
      resource: { eventId: e.id },
    }));
  }, [events]);

  const handleNavigate = (action: "PREV" | "NEXT" ) => {
    if (view === Views.MONTH) {
      if (action === "PREV") setDate((prev) => addDays(prev, -30)); 
      if (action === "NEXT") setDate((prev) => addDays(prev, 30));
    } else {
      if (action === "PREV") setDate((prev) => subDays(prev, 7));
      if (action === "NEXT") setDate((prev) => addDays(prev, 7));
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "1560px",
        width: "100%",
        margin: "0 auto",
        backgroundColor: "#f8fafd",
      }}
    >
      {/* HEADER & TOOLBAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0 }}>
            My Events
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            View and manage your event calendar
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/create-event")}
        >
          Create Event
        </Button>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            onClick={() => handleNavigate("PREV")}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: 1,
              transition: "all 0.2s ease-in-out",
              width: "36px",

              "&:hover": {
                borderColor: "#1976d2",
                color: "#1976d2",
                boxShadow: 3,
                backgroundColor: "#fff",
              },
              "&:focus": {
                borderColor: "#1976d2",
                outline: "none",
              },
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.25rem",
              minWidth: "180px",
              textAlign: "center",
            }}
          >
            {format(
              date,
              view === Views.MONTH ? "MMMM yyyy" : "'Week of' MMM d",
            )}
          </Typography>
          <IconButton
            onClick={() => handleNavigate("NEXT")}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: 1,
              transition: "all 0.2s ease-in-out",
              width: "36px",

              "&:hover": {
                borderColor: "#1976d2",
                color: "#1976d2",
                boxShadow: 3,
                backgroundColor: "#fff",
              },
              "&:focus": {
                borderColor: "#1976d2",
                outline: "none",
              },
            }}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Stack>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          sx={{
            gap: 1,
            "& .MuiToggleButtonGroup-grouped": {
              border: "1px solid #e5e7eb",
              borderRadius: "8px ",
              textTransform: "none",
              px: 3,
              py: 0.5,
              boxShadow: 1,
              "&.Mui-selected": {
                backgroundColor: "#1976d2",
                color: "white",
                "&:hover": {
                  boxShadow: 3,
                  backgroundColor: "#0582ff",
                  borderColor: "#60a5ea",
                },
              },
              "&:focus": {
                outline: "none",
              },
            },
          }}
        >
          <ToggleButton value={Views.MONTH}>Month</ToggleButton>
          <ToggleButton value={Views.WEEK}>Week</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* CONDITIONAL RENDERING */}
      {view === Views.MONTH ? (
        <Box
          sx={{
            height: 600,
            width: "100%",
            backgroundColor: "#ffffff",
            "& .rbc-calendar": { fontFamily: "inherit" },
            "& .rbc-header": {
              padding: "12px",
              fontWeight: 600,
              backgroundColor: "#f5f4f5",
              borderBottom: "1px solid #e5e7eb",
              borderLeft: "none",
              color: "#374151",
            },
            "& .rbc-event": {
              backgroundColor: "#EAF6FF",
              color: "#1976d2",
              fontSize: "14px",
              padding: "1px 5px",
              borderRadius: "4px",
              border: "1px solid #dbeafe",
              "&:hover": {
                backgroundColor: "#dbeafe",
              },
            },
            "& .rbc-date-cell": {
              textAlign: "left",
              padding: "8px",
              fontSize: "0.9rem",
              color: "#6b7280",
              display: "flex",
              justifyContent: "flex-start",
            },
            "& .rbc-today": {
              backgroundColor: "transparent !important",
              position: "relative",

              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: "#1976d2",
                zIndex: 2,
              },

              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "3px",
                backgroundColor: "#1976d2",
                zIndex: 2,
              },
            },
            "& .rbc-off-range-bg": {
              backgroundColor: "#eef0f3",
              opacity: 0.6,
            },
          }}
        >
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            view={Views.MONTH}
            date={date}
            toolbar={false}
            onNavigate={setDate}
            onSelectEvent={(e: any) =>
              navigate(`/events/${e.resource.eventId}`)
            }
            components={{
              event: ({ event }: any) => (
                <span>
                  {format(event.start, "HH:mm")} - {event.title}
                </span>
              ),
            }}
          />
        </Box>
      ) : (
        <WeeklyCalendarView currentDate={date} events={events || []} />
      )}
    </Box>
  );
}
