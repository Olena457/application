import { useNavigate } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { useCreateEventMutation } from "../store/api/eventsApi";
import { EventForm } from "../components/EventForm";
import type { EventFormData } from "../components/EventForm";

import { formatEventPayload } from "../utils/eventHelpers";
import { getApiErrorMessage } from "../utils/errorHelpers";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [createEvent, { isLoading, error }] = useCreateEventMutation();

  const handleOnSubmit = async (data: EventFormData) => {
    try {
      const payload = formatEventPayload(data);
      const event = await createEvent(payload as any).unwrap();
      navigate(`/events/${event.id}`);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
        Create New Event
      </Typography>

      <EventForm
        onSubmit={handleOnSubmit}
        isLoading={isLoading}
        onCancel={() => navigate(-1)}
        apiError={getApiErrorMessage(error)}
        submitLabel="Create Event"
      />
    </Paper>
  );
}
