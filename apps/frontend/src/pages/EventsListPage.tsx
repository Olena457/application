import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import {
  useGetPublicEventsQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
} from '../store/api/eventsApi';
import type { RootState } from '../store';
import type { Event } from '../types/event';

function EventCard({
  event,
  isParticipant,
  isOrganizer,
  onJoin,
  onLeave,
  onView,
  isLoading,
}: {
  event: Event;
  isParticipant: boolean;
  isOrganizer: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onView: () => void;
  isLoading: boolean;
}) {
  const count =
    event._count?.participants ?? event.participantCount ?? event.participants?.length ?? 0;
  const capacity = event.capacity;
  const isFull = capacity !== null && count >= capacity;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {event.description
            ? event.description.length > 100
              ? `${event.description.slice(0, 100)}...`
              : event.description
            : 'No description'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
        {format(new Date(event.date), 'PPp')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
           {event.location}
        </Typography>
        <Typography variant="body2">
          👥 {count}
          {capacity ? ` / ${capacity}` : ''} participants
        </Typography>
        {isFull && (
          <Chip label="Full" color="error" size="small" sx={{ mt: 1 }} />
        )}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onView}>
          View Details
        </Button>
        {!isOrganizer &&
          (isParticipant ? (
            <Button
              size="small"
              color="secondary"
              onClick={onLeave}
              disabled={isLoading}
            >
              Leave
            </Button>
          ) : (
            <Button
              size="small"
              color="primary"
              onClick={onJoin}
              disabled={isFull || isLoading}
            >
              Join
            </Button>
          ))}
      </CardActions>
    </Card>
  );
}

export default function EventsListPage() {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: events, isLoading, error } = useGetPublicEventsQuery();
  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();

  const isParticipant = (event: Event) =>
    event.participants?.some(
      (p) => (p.user?.id ?? p.userId) === userId
    ) ?? false;
  const isOrganizer = (event: Event) => event.organizerId === userId;

  const handleJoin = async (id: string) => {
    try {
      await joinEvent(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeave = async (id: string) => {
    try {
      await leaveEvent(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={200} sx={{ flex: '1 1 300px', minWidth: 0 }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Failed to load events. Please try again.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Public Events
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {events?.map((event) => (
          <Box key={event.id} sx={{ flex: '1 1 300px', minWidth: 0, maxWidth: 400 }}>
            <EventCard
              event={event}
              isParticipant={isParticipant(event)}
              isOrganizer={isOrganizer(event)}
              onJoin={() => handleJoin(event.id)}
              onLeave={() => handleLeave(event.id)}
              onView={() => navigate(`/events/${event.id}`)}
              isLoading={isJoining || isLeaving}
            />
          </Box>
        ))}
      </Box>
      {events?.length === 0 && (
        <Typography color="text.secondary">
          No public events at the moment. Check back later!
        </Typography>
      )}
    </Box>
  );
}
