import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

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
import { ParticipantsList } from "../components/ParticipantsList";
import { Loader} from "../components/Loader";

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

  if (isLoading) return <Loader />;

  if (error || !event) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        Event not found.
      </Typography>
    );
  }

  return (
    <Box sx={{py:{ xs: 7, md: 13 }, px:{ xs: 1, md: 4 } }}>
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

        <ParticipantsList  participants={event.participants || []} />
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
