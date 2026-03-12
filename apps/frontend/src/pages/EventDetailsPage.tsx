
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  ListItemIcon,
} from "@mui/material";
import {
  useGetEventQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventCard } from "../components/EventCard";

export default function EventDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: event,
    isLoading,
    error,
  } = useGetEventQuery(id!, { skip: !id });

  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();

  if (isLoading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error || !event) {
    return <Typography color="error">Event not found.</Typography>;
  }

  const isOrganizer = event.organizerId === userId;
  const isParticipant =
    event.participants?.some((p) => (p.user?.id ?? p.userId) === userId) ??
    false;

  return (
    <Box sx={{ py: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(350px, 1fr) 1.5fr",
          },
          gap: 3,
          width: "100%",
        }}
      >
        <Box>
          <EventCard
            event={event}
            viewLabel="Back"
            onView={() => navigate(-1)}
            isParticipant={isParticipant}
            isOrganizer={isOrganizer}
            onJoin={() => joinEvent(event.id)}
            onLeave={() => leaveEvent(event.id)}
            onEdit={() => navigate(`/events/${event.id}/edit`)}
            isLoading={isJoining || isLeaving}
          />
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Participants
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <List sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "450px" }}>
            {event.participants && event.participants.length > 0 ? (
              event.participants.map((p) => (
                <ListItem
                  key={p.id ?? p.userId}
                  disableGutters
                  sx={{ py: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: "24px" }}>
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={p.user?.name || "Anonymous User"}
                    slotProps={{
                      primary: {
                        variant: "body1",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No participants for this event yet.
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}