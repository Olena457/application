import { useNavigate } from "react-router-dom";
import { Paper, Typography, Box, Button } from "@mui/material";
import { useCreateEventMutation } from "../store/api/eventsApi";
import { EventForm } from "../components/EventForm";
import type { EventFormData } from "../utils/event.validation";

import { formatEventPayload } from "../utils/eventHelpers";
import { getApiErrorMessage } from "../utils/errorHelpers";
import { ArrowLeft } from "lucide-react";


const DEEP_OCEAN: [string, string] = ["#1A2980", "#1eb4ea"];
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
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        borderRadius: 4,
        display: "flex",
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600 }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowLeft size={20} />}
          sx={{
            mb: 3,
            textTransform: "none",
            color: "#333",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.7,
              borderRadius: 2,
            },
          }}
        >
          Back
        </Button>

        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: "16px",
            p: { xs: 2, sm: 4 },
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
                mb: 2,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
                fontWeight: 600,
                background: `linear-gradient(135deg, ${DEEP_OCEAN[0]} 10%, ${DEEP_OCEAN[1]} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create New Event
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                lineHeight: { xs: 1.2, sm: 1.43 },
              }}
            >
              Fill in the details to create an amazing event
            </Typography>
          </Box>

          <EventForm
            onSubmit={handleOnSubmit}
            isLoading={isLoading}
            onCancel={() => navigate(-1)}
            apiError={getApiErrorMessage(error)}
            submitLabel="Create Event"
          />
        </Paper>
      </Box>
    </Box>
  );
}
