
import { Box, Typography } from "@mui/material";
import { EventCard } from "./EventCard";
import type { Event } from "../types/event";

interface EventsListProps {
  events: Event[];
  userId?: string;
  token?: string | null;
  isJoining: boolean;
  isLeaving: boolean;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  searchQuery: string;
}

export const EventsList = ({
  events,
  userId,
  token,
  isJoining,
  isLeaving,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onView,
  searchQuery,
}: EventsListProps) => {
  if (events.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        {searchQuery
          ? `No results found for "${searchQuery}".`
          : "No events available at the moment."}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      {events.map((event) => {
        const isParticipant =
          event.participants?.some((p) => {
            const participantId = p.id || p.userId || p.user?.id;
            return String(participantId) === String(userId);
          }) ?? false;
        
       

        const isOrganizer = userId
          ? String(event.organizerId) === String(userId)
          : false;
        return (
          <Box
            key={event.id}
            sx={{
              flex: "1 1 300px",
              minWidth: 0,
              maxWidth: { xs: "100%", sm: "400px" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <EventCard
              event={event}
              isLoggedIn={!!token}
              isParticipant={isParticipant}
              isOrganizer={isOrganizer}
              onEdit={() => onEdit(event.id)}
              onJoin={() => onJoin(event.id)}
              onDelete={() => onDelete(event.id)}
              onLeave={() => onLeave(event.id)}
              onView={() => onView(event.id)}
              isLoading={isJoining || isLeaving}
            />
          </Box>
        );
      })}
    </Box>
  );
};
