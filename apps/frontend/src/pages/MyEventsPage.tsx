
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { dateFnsLocalizer, Calendar, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetMyEventsQuery } from "../store/api/eventsApi";
import { WeeklyCalendarView } from "../components/WeeklyCalendarView";
import { CalendarHeader } from "../components/CalendarHeader";

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

  const handleNavigate = (action: "PREV" | "NEXT") => {
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
        p: { xs: 2, sm: 4 },
        maxWidth: "1560px",
        width: "100%",
        margin: "0 auto",
        borderRadius: 4,
        backgroundColor: "#f8f9fa",
      }}
    >
      <CalendarHeader
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onViewChange={setView}
        onCreateClick={() => navigate("/events/create")}
      />

      {/* CONDITIONAL RENDERING */}
      {view === Views.MONTH ? (
        <Box
          sx={{
            height: { xs: 500, sm: 600 },
            width: "100%",
            backgroundColor: "#ffffff",
            "& .rbc-calendar": { fontFamily: "inherit" },
            "& .rbc-header": {
              padding: { xs: "6px", sm: "12px" },
              fontWeight: 600,
              backgroundColor: "#f5f4f5",
              borderBottom: "1px solid #e5e7eb",
              borderLeft: "none",
              color: "#374151",
              fontSize: { xs: "0.75rem", sm: "0.9rem" },
            },
            "& .rbc-event": {
              backgroundColor: "#EAF6FF",
              color: "#1976d2",
              fontSize: { xs: "11px", sm: "14px" },
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
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
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