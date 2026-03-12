
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  AlertTitle,
  Button,
  Snackbar,
} from "@mui/material";

import {
  useGetPublicEventsQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventsList } from "../components/EventsList"; 
import { SearchBar } from "../components/SearchBar";

export default function EventsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data: events, isLoading, error, refetch } = useGetPublicEventsQuery();
  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();

  const handleJoinAction = async (eventId: string) => {
    if (!token) {
      setOpenAlert(true);
      return;
    }
    try {
      await joinEvent(eventId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

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
          Failed to fetch events list.
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

      <EventsList
        events={filteredEvents}
        userId={userId}
        token={token}
        isJoining={isJoining}
        isLeaving={isLeaving}
        onJoin={handleJoinAction}
        onLeave={(id) => leaveEvent(id)}
        onEdit={(id) => navigate(`/events/${id}/edit`)}
        onView={(id) => navigate(`/events/${id}`)}
        searchQuery={searchQuery}
      />

      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity="warning"
          variant="filled"
          sx={{ backgroundColor: "#48ce5c", color: "#000", fontWeight: 600 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/login")}
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Login Now
            </Button>
          }
        >
          Please sign in to join events!
        </Alert>
      </Snackbar>
    </Box>
  );
}