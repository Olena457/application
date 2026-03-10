import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { dateFnsLocalizer, Calendar } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetMyEventsQuery } from '../store/api/eventsApi';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) => format(date, formatStr),
  parse: (value: string, formatStr: string, refDate: unknown) =>
    parse(value, formatStr, refDate instanceof Date ? refDate : new Date()),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: { eventId: string };
}

export default function MyEventsPage() {
  const navigate = useNavigate();
  const { data: events, isLoading, error } = useGetMyEventsQuery(undefined, {
    skip: false,
  });

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    if (!events) return [];
    return events.map((e) => {
      const start = new Date(e.date);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour default
      return {
        id: e.id,
        title: e.title,
        start,
        end,
        resource: { eventId: e.id },
      };
    });
  }, [events]);

  const handleSelectEvent = useCallback(
    (event: { id?: string | number; resource?: unknown }) => {
      const res = event.resource as { eventId?: string } | undefined;
      const eventId = res?.eventId ?? event.id;
      if (eventId != null) navigate(`/events/${String(eventId)}`);
    },
    [navigate]
  );

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) {
    return (
      <Typography color="error">
        Failed to load your events. Please sign in.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Events
      </Typography>
      {calendarEvents.length === 0 ? (
        <Typography color="text.secondary">
          You are not part of any events yet. Explore public events and join.
        </Typography>
      ) : (
        <Box sx={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week']}
            defaultView="month"
          />
        </Box>
      )}
    </Box>
  );
}
