
import { useNavigate } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { useCreateEventMutation } from "../store/api/eventsApi";
import { EventForm } from "../components/EventForm";
import type { EventFormData } from "../components/EventForm";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [createEvent, { isLoading, error }] = useCreateEventMutation();

  const handleOnSubmit = async (data: EventFormData) => {
    try {
      const payload = {
        ...data,
        date: data.date.toISOString(),
        description: data.description || undefined,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      };

      const event = await createEvent(payload).unwrap();
      navigate(`/events/${event.id}`);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const apiErrorMessage =
    error && "data" in error && error.data && typeof error.data === "object"
      ? (error.data as any).message?.toString() || "An error occurred"
      : null;

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
        Create New Event
      </Typography>

      <EventForm
        onSubmit={handleOnSubmit}
        isLoading={isLoading}
        onCancel={() => navigate(-1)}
        apiError={apiErrorMessage}
        submitLabel="Create Event"
      />
    </Paper>
  );
}
