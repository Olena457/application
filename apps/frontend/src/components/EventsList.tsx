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
      {events.map((event) => (
        <Box
          key={event.id}
          sx={{ flex: "1 1 300px", minWidth: 0, maxWidth: 400 }}
        >
          <EventCard
            event={event}
            isLoggedIn={!!token}
            isParticipant={
              event.participants?.some(
                (p) => (p.user?.id ?? p.userId) === userId,
              ) ?? false
            }
            isOrganizer={event.organizerId === userId}
            onEdit={() => onEdit(event.id)}
            onJoin={() => onJoin(event.id)}
            onLeave={() => onLeave(event.id)}
            onView={() => onView(event.id)}
            isLoading={isJoining || isLeaving}
          />
        </Box>
      ))}
    </Box>
  );
};
