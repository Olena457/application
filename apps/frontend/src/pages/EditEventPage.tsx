import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Paper, Typography, Button, Alert } from "@mui/material";

import {
  useGetEventQuery,
  useUpdateEventMutation,
} from "../store/api/eventsApi";
import type { RootState } from "../store";
import { EventForm } from "../components/EventForm";
import type { EventFormData } from "../utils/event.validation";


import { formatEventPayload } from "../utils/eventHelpers";
import { getApiErrorMessage } from "../utils/errorHelpers";
import { Loader } from "../components/Loader";
import { ArrowLeft } from "lucide-react";


const DEEP_OCEAN: [string, string] = ["#1A2980", "#1eb4ea"];

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

  if (isLoading) return <Loader />;

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
          sx={{ p: 4, width: "100%", maxWidth: 600, borderRadius: "16px" }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{
              display: "inline-block",
              width: "fit-content",
              mb: 3,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${DEEP_OCEAN[0]} 10%, ${DEEP_OCEAN[1]} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Edit Event
          </Typography>

          <EventForm
            initialValues={{
              title: event.title,
              description: event.description || "",
              date: new Date(event.date),
              location: event.location,
              capacity: event.capacity ?? undefined,
              visibility:
                (event.visibility as "Public" | "Private") || "Public",
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
    </Box>
  );
}
