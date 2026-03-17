
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiAssistant } from "../components/AiAssistant";
import { EventsSkeleton } from "../components/EventsSkeleton";
import {
  Box,
} from "@mui/material";

import {
  useGetPublicEventsQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
  useDeleteEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventsList } from "../components/EventsList";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { AuthAlert } from "../components/AuthAlert";
import { PaginationControls } from "../components/PaginationControls";
import { EventsError } from "../components/EventsError";
import { EventsHeader } from "../components/EventsHeader";

export default function EventsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

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

  const { data, isLoading, error, refetch } = useGetPublicEventsQuery(page, {
    refetchOnMountOrArgChange: true,
  });

  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const events = data?.events || [];
  const lastPage = data?.lastPage || 1;

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const q = searchQuery.toLowerCase();

    return events
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
      }));
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

 if (isLoading) return <EventsSkeleton count={8} />;

  if (error) return <EventsError onRetry={() => refetch()} />;

 return (
   <Box sx={{ py: 2 }}>
     <EventsHeader
       searchQuery={searchQuery}
       onSearchChange={(val) => {
         setSearchQuery(val);
         setPage(1);
       }}
     />

     {token && (
       <Box sx={{ my: 3 }}>
         <AiAssistant />
       </Box>
     )}

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

     <PaginationControls
       page={page}
       count={lastPage}
       onChange={(newPage) => {
         setPage(newPage);
         window.scrollTo({ top: 0, behavior: "smooth" });
       }}
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