
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiAssistant } from "../components/AiAssistant";
import { EventsSkeleton } from "../components/EventsSkeleton";
import { Box, Typography } from "@mui/material";

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

const DEEP_OCEAN: [string, string] = ["#1A2980", "#1eb4ea"];

export default function EventsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    data,
    isLoading,
    error,
    refetch,
  } = useGetPublicEventsQuery(page, {
    refetchOnMountOrArgChange: true,
  });
  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const events = data?.events || [];
  const lastPage = data?.lastPage || 1;

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    events.forEach((event) => {
      event.tags?.forEach((tag: any) => {
        const tagName = typeof tag === "object" ? tag.name : tag;
        if (tagName) tagsSet.add(tagName);
      });
    });
    return Array.from(tagsSet);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const q = searchQuery.toLowerCase();

    return events
      .filter((e) => {
        const matchesQuery =
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q);

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some((selectedTag) =>
            e.tags?.some((eventTag: any) => {
              const name =
                typeof eventTag === "object" ? eventTag.name : eventTag;
              return name === selectedTag;
            }),
          );

        return matchesQuery && matchesTags;
      })
      .map((event) => ({
        ...event,
        isParticipant:
          event.participants?.some((p: any) => {
            const pId = p.id || p.userId || p.user?.id;
            return String(pId) === String(userId);
          }) ?? false,
        isOrganizer: String(event.organizerId) === String(userId),
      }));
  }, [events, searchQuery, userId, selectedTags]);

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
    <Box
      sx={{
        py: 2,
        px: { xs: 1, lg: 4 },
        borderRadius: 4,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            display: "inline-block",
            width: "fit-content",
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
            background: `linear-gradient(135deg, ${DEEP_OCEAN[0]} 10%, ${DEEP_OCEAN[1]} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Discover Events
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          px: { xs: 1, lg: 10 },
          gap: 3,
          mb: 3,
          alignItems: { xs: "stretch" },
          justifyContent: "center",
        }}
      >
        {token && (
          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: { xs: "500px", md: "none" },
            }}
          >
            <AiAssistant />
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          {/* props EventsHeader */}
          <EventsHeader
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
            selectedTags={selectedTags}
            onTagsChange={(tags: string[]) => {
              setSelectedTags(tags);
              setPage(1);
            }}
            availableTags={availableTags}
          />
        </Box>
      </Box>

      {/* Empty State*/}
      {filteredEvents.length === 0 && (
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ py: 10 }}
        >
          No events match the selected tags or search query.
        </Typography>
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