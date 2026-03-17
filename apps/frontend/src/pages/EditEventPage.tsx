import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Paper, Typography, Button, Alert } from "@mui/material";

import {
  useGetEventQuery,
  useUpdateEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventForm, type EventFormData } from "../components/EventForm";

import { formatEventPayload } from "../utils/eventHelpers";
import { getApiErrorMessage } from "../utils/errorHelpers";
import { EventDetailsSkeleton } from "../components/EventDetailsSkeleton";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: event,
    isLoading,
    error,
  } = useGetEventQuery(id!, { skip: !id });
  const [updateEvent, { isLoading: isUpdating, error: updateError }] =
    useUpdateEventMutation();

  useEffect(() => {
    if (event && userId && event.organizerId !== userId) {
      navigate("/events");
    }
  }, [event, userId, navigate]);

  const handleOnSubmit = async (data: EventFormData) => {
    if (!id) return;
    try {
      const payload = formatEventPayload(data);
      await updateEvent({ id, data: payload as any }).unwrap();
      navigate(`/events/${id}`);
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  if (isLoading) return <EventDetailsSkeleton />;

  if (error || !event) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Alert severity="error">
          {getApiErrorMessage(error) ||
            "Event not found or failed to load data."}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/events")}>
          Back to Events
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 600, borderRadius: "16px" }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Edit Event
        </Typography>

        <EventForm
          initialValues={{
            title: event.title,
            description: event.description || "",
            date: new Date(event.date),
            location: event.location,
            capacity: event.capacity ?? undefined,
            visibility: (event.visibility as "Public" | "Private") || "Public",
            tags:
              event.tags?.map((t: any) => t.name || t).filter(Boolean) || [],
          }}
          onSubmit={handleOnSubmit}
          isLoading={isUpdating}
          onCancel={() => navigate(-1)}
          apiError={getApiErrorMessage(updateError)}
          submitLabel="Save Changes"
        />
      </Paper>
    </Box>
  );
}
