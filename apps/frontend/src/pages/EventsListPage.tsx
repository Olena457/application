
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
} from "@mui/material";

import {
  useGetPublicEventsQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
  useDeleteEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventsList } from "../components/EventsList";
import { SearchBar } from "../components/SearchBar";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { AuthAlert } from "../components/AuthAlert";

export default function EventsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [alertConfig, setAlertConfig] = useState<{
    open: boolean;
    message: string;
    severity: "warning" | "info" | "success" | "error";
    showLogin: boolean;
  }>({
    open: false,
    message: "",
    severity: "warning",
    showLogin: false,
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: events,
    isLoading,
    error,
    refetch,
  } = useGetPublicEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const q = searchQuery.toLowerCase();

    return (
      events
        .filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q),
        )
        .map((event) => ({
          ...event,
          isParticipant:
            event.participants?.some((p: any) => {
              const pId = p.id || p.userId || p.user?.id;
              return String(pId) === String(userId);
            }) ?? false,
          isOrganizer: String(event.organizerId) === String(userId),
        }))
    );
        
  }, [events, searchQuery, userId]);

  const handleJoinAction = async (eventId: string) => {
    if (!token) {
      setAlertConfig({
        open: true,
        message: "Please sign in to join events!",
        severity: "warning",
        showLogin: true,
      });
      return;
    }

    try {
      await joinEvent(eventId).unwrap();
      setAlertConfig({
        open: true,
        message: "Successfully joined!",
        severity: "success",
        showLogin: false,
      });
    } catch (err) {
      console.error("Join failed:", err);
    }
  };

  const handleLeaveAction = async (eventId: string) => {
    try {
      await leaveEvent(eventId).unwrap();
      setAlertConfig({
        open: true,
        message: "You have successfully left the event.",
        severity: "info",
        showLogin: false,
      });
    } catch (err) {
      console.error("Leave failed:", err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedEventId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEventId) return;
    try {
      await deleteEvent(selectedEventId).unwrap();
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedEventId(null);
    }
  };

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
          <AlertTitle>Error Loading Events</AlertTitle>
          Something went wrong while fetching the events list.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Discover Events
      </Typography>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <EventsList
        events={filteredEvents}
        userId={userId}
        token={token}
        isJoining={isJoining}
        isLeaving={isLeaving}
        onJoin={handleJoinAction}
        onLeave={handleLeaveAction}
        onEdit={(id) => navigate(`/events/${id}/edit`)}
        onView={(id) => navigate(`/events/${id}`)}
        onDelete={handleDeleteClick}
        searchQuery={searchQuery}
      />

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        confirmLabel="Yes, Delete"
      />

      <AuthAlert
        open={alertConfig.open}
        message={alertConfig.message}
        severity={alertConfig.severity}
        showLoginButton={alertConfig.showLogin}
        onClose={() => setAlertConfig((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}