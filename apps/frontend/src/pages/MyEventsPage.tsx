
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { dateFnsLocalizer, Calendar, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetMyEventsQuery } from "../store/api/eventsApi";
import { WeeklyCalendarView } from "../components/WeeklyCalendarView";
import { CalendarHeader } from "../components/CalendarHeader";
import { eventPropGetter } from "../helpers/tagColors";
import { Loader } from "../components/Loader";

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
      resource: {
        eventId: e.id,
        firstTag: e.tags?.[0],
      },
    }));
  }, [events]);

  const handleNavigate = (action: "PREV" | "NEXT") => {
    if (view === Views.MONTH) {
      setDate((prev) =>
        action === "PREV" ? addDays(prev, -30) : addDays(prev, 30),
      );
    } else {
      setDate((prev) =>
        action === "PREV" ? subDays(prev, 7) : addDays(prev, 7),
      );
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: "1560px",
        margin: "0 auto",
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

      {view === Views.MONTH ? (
        <Box
          sx={{
            height: 600,
            bgcolor: "#fff",
            p: 2,
            borderRadius: 2,
            "& .rbc-event": { border: "none", outline: "none !important" },
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
              opacity: 0.7,
            },
          }}
        >
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            view={Views.MONTH}
            eventPropGetter={eventPropGetter}
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