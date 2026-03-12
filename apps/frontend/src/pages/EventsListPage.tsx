
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  AlertTitle,
  Button,
} from "@mui/material";
import { RefreshCw } from "lucide-react";

import {
  useGetPublicEventsQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventCard } from "../components/EventCard";
import { SearchBar } from "../components/SearchBar";

export default function EventsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data: events, isLoading, error, refetch } = useGetPublicEventsQuery();

  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q),
    );
  }, [events, searchQuery]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 4 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={250}
            sx={{ flex: "1 1 300px", borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
        <Alert
          severity="error"
          variant="outlined"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => refetch()}
              startIcon={<RefreshCw size={16} />}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Loading Error</AlertTitle>
          Failed to fetch events list. Please check your internet connection or
          try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Discover Events
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Find and join exciting events happening around you
      </Typography>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            sx={{ flex: "1 1 300px", minWidth: 0, maxWidth: 400 }}
          >
            <EventCard
              event={event}
              isParticipant={
                event.participants?.some(
                  (p) => (p.user?.id ?? p.userId) === userId,
                ) ?? false
              }
              isOrganizer={event.organizerId === userId}
              onEdit={() => navigate(`/events/${event.id}/edit`)}
              onJoin={() => joinEvent(event.id)}
              onLeave={() => leaveEvent(event.id)}
              onView={() => navigate(`/events/${event.id}`)}
              isLoading={isJoining || isLeaving}
            />
          </Box>
        ))}
      </Box>

      {filteredEvents.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          {searchQuery
            ? `No results found for "${searchQuery}".`
            : "No events available at the moment."}
        </Typography>
      )}
    </Box>
  );
}
