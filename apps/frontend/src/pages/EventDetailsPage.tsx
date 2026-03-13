


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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  useGetEventQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
  useDeleteEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventCard } from "../components/EventCard";

export default function EventDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const token = useSelector((state: RootState) => state.auth.token);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const {
    data: event,
    isLoading,
    error,
  } = useGetEventQuery(id!, { skip: !id });

  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const handleDeleteClick = () => setOpenDeleteDialog(true);
  const handleDeleteClose = () => setOpenDeleteDialog(false);

  const handleJoinAction = async () => {
    if (!token) {
      setOpenAlert(true);
      return;
    }
    try {
      await joinEvent(event!.id).unwrap();
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
            isLoggedIn={!!token}
            isOrganizer={isOrganizer}
            onDelete={handleDeleteClick}
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

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        disableRestoreFocus
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

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
          sx={{ backgroundColor: "#ff6b6b", color: "#000", fontWeight: 600 }}
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
