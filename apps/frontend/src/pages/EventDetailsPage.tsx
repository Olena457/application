
import { useState } from "react";
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
  useDeleteEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventCard } from "../components/EventCard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { AuthAlert } from "../components/AuthAlert";

export default function EventDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const token = useSelector((state: RootState) => state.auth.token);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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

  const {
    data: event,
    isLoading,
    error,
  } = useGetEventQuery(id!, { skip: !id });
  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();


  const isParticipant =
    event?.participants?.some((p) => (p.user?.id ?? p.userId) === userId) ??
    false;
  const isOrganizer = event?.organizerId === userId;

  const handleJoinAction = async () => {
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
      
      await joinEvent(event!.id).unwrap();
      setAlertConfig({
        open: true,
        message: "Successfully joined!",
        severity: "success",
        showLogin: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!event) return;
    try {
      await deleteEvent(event.id).unwrap();
      navigate("/events");
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        Event not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(350px, 1fr) 1.5fr" },
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
            isLoggedIn={!!token}
            isOrganizer={isOrganizer}
            onDelete={() => setOpenDeleteDialog(true)}
            onJoin={handleJoinAction}
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
            Participants ({event.participants?.length || 0})
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
                      primary: { variant: "body1", fontWeight: 500 },
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No participants yet.
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
      </Box>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this event?"
        confirmLabel="Yes, Delete"
        isLoading={isDeleting}
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