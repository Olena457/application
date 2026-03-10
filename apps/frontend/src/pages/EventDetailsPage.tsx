import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import {
  useGetEventQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
  useDeleteEventMutation,
} from '../store/api/eventsApi';
import type { RootState } from '../store';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: event, isLoading, error } = useGetEventQuery(id!, {
    skip: !id,
  });
  const [joinEvent] = useJoinEventMutation();
  const [leaveEvent] = useLeaveEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const isOrganizer = event?.organizerId === userId;
  const isParticipant =
    event?.participants?.some(
      (p) => (p.user?.id ?? p.userId) === userId
    ) ?? false;
  const count =
    event?.participantCount ??
    event?.participants?.length ??
    event?._count?.participants ??
    0;
  const capacity = event?.capacity;
  const isFull = capacity !== null && capacity !== undefined && count >= capacity;

  const handleJoin = async () => {
    if (!id) return;
    try {
      await joinEvent(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeave = async () => {
    if (!id) return;
    try {
      await leaveEvent(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteEvent(id).unwrap();
      setConfirmOpen(false);
      navigate('/events');
    } catch (e) {
      console.error(e);
    }
  };

  if (!id || isLoading) {
    return <Skeleton variant="rectangular" height={400} />;
  }

  if (error || !event) {
    return (
      <Typography color="error">
        Event not found or you don&apos;t have access.
      </Typography>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {event.description || 'No description'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          📅 {format(new Date(event.date), 'PPP p')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          📍 {event.location}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          👥 {count}
          {capacity ? ` / ${capacity} participants` : ' participants'}
        </Typography>

        {event.organizer && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Organized by: {event.organizer.name || event.organizer.email}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {!isOrganizer &&
            (isParticipant ? (
              <Button variant="outlined" color="secondary" onClick={handleLeave}>
                Leave Event
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleJoin}
                disabled={isFull}
              >
                {isFull ? 'Full' : 'Join Event'}
              </Button>
            ))}
          {isOrganizer && (
            <>
              <Button
                variant="contained"
                onClick={() => navigate(`/events/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          Participants
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {event.participants?.map((p) => (
            <Typography key={p.id ?? p.userId} variant="body2" sx={{ mr: 1 }}>
              • {p.user?.name || p.user?.email || 'Unknown'}
            </Typography>
          ))}
          {(!event.participants || event.participants.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              No participants yet
            </Typography>
          )}
        </Box>
      </Paper>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={isDeleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
