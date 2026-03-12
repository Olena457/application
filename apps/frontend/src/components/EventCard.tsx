
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Button,
} from "@mui/material";
import { Calendar, Clock4, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "../types/event";

interface EventCardProps {
  event: Event;
  isParticipant: boolean;
  isOrganizer: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onView: () => void;
  onEdit: () => void;
  isLoading: boolean;
  viewLabel?: string;
  isLoggedIn?: boolean; 
}

export const EventCard = ({
  event,
  isParticipant,
  isOrganizer,
  onJoin,
  onLeave,
  onView,
  onEdit,
  isLoading,
  viewLabel = "Details",
  isLoggedIn = false, 
}: EventCardProps) => {
  const count =
    event._count?.participants ??
    event.participantCount ??
    event.participants?.length ??
    0;
  const capacity = event.capacity;
  const isFull = capacity !== null && count >= capacity;

  const iconRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.5,
    color: "text.secondary",
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {event.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 2, color: "text.secondary", minHeight: "40px" }}
        >
          {event.description && event.description.length > 50
            ? `${event.description.slice(0, 50)}...`
            : event.description || "No description"}
        </Typography>

        <Box sx={iconRowStyle}>
          <Calendar size={16} />
          <Typography variant="body2">
            {format(new Date(event.date), "MMM dd, yyyy")}
          </Typography>
        </Box>
        <Box sx={iconRowStyle}>
          <Clock4 size={16} />
          <Typography variant="body2">
            {format(new Date(event.date), "p")}
          </Typography>
        </Box>
        <Box sx={iconRowStyle}>
          <MapPin size={16} />
          <Typography variant="body2">{event.location}</Typography>
        </Box>
        <Box sx={{ ...iconRowStyle, mt: 1 }}>
          <Users size={16} />
          <Typography variant="body2">
            {count} {capacity ? `/ ${capacity}` : ""} participants
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {isLoggedIn ? (
          <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              onClick={onView}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                "&:focus": { outline: "none" },
              }}
            >
              {viewLabel}
            </Button>

            {isOrganizer ? (
              <Button
                fullWidth
                size="small"
                variant="contained"
                onClick={onEdit}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#2E8B57",
                  "&:hover": { backgroundColor: "#37a768" },
                  "&:focus": { outline: "none" },
                }}
              >
                Edit
              </Button>
            ) : isParticipant ? (
              <Button
                fullWidth
                size="small"
                variant="contained"
                color="error"
                onClick={onLeave}
                disabled={isLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#ff6b6b",
                  "&:hover": { backgroundColor: "#fa5252" },
                  "&:focus": { outline: "none" },
                }}
              >
                Leave
              </Button>
            ) : (
              <Button
                fullWidth
                size="small"
                variant="contained"
                onClick={onJoin}
                disabled={isFull || isLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  "&:focus": { outline: "none" },
                }}
              >
                Join
              </Button>
            )}
          </Box>
        ) : (
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={onJoin}
            disabled={isLoading}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              py: 1,
              borderRadius: "8px",
              backgroundColor: "#2E8B57",
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "#37a768",
                boxShadow: 2,
              },
              "&:focus": { outline: "none" },
            }}
          >
            Join Event
          </Button>
        )}
      </CardActions>
    </Card>
  );
};