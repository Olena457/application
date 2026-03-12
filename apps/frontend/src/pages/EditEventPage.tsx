


import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Paper, Typography, CircularProgress, Alert, Button } from "@mui/material";
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from "../store/api/eventsApi";
import { EventForm } from "../components/EventForm";
import type { EventFormData } from "../components/EventForm";
import type { RootState } from "../store";

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
      const payload = {
        ...data,
        date: data.date.toISOString(),
        capacity: data.capacity ? Number(data.capacity) : undefined,
      };
      await updateEvent({ id, data: payload }).unwrap();
      navigate(`/events/${id}`);
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  const apiErrorMessage =
    updateError && "data" in updateError
      ? (updateError.data as any).message?.toString()
      : null;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Alert severity="error">
          {error && "data" in error 
            ? (error.data as any).message 
            : "Event not found or failed to load data."}
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
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          height: "auto",
          borderRadius: "16px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
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
          }}
          onSubmit={handleOnSubmit}
          isLoading={isUpdating}
          onCancel={() => navigate(-1)}
          apiError={apiErrorMessage}
          submitLabel="Save Changes"
        />
      </Paper>
    </Box>
  );
}