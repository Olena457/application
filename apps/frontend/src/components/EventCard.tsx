
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
import { ExpandDescription } from "./ExpandDescription";

interface EventCardProps {
  event: Event;
  isParticipant: boolean;
  isOrganizer: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
  onDelete,
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

        <ExpandDescription text={event.description ?? ""} />

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
        <Box sx={{ display: "flex", gap: 1, width: "100%", flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={onView}
            sx={{
              flex: 1,
              textTransform: "none",
              fontWeight: 600,
              "&:focus": { outline: "none" },
            }}
          >
            {viewLabel}
          </Button>

          {isLoggedIn ? (
            <>
              {isOrganizer ? (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={onEdit}
                    sx={{
                      flex: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor: "#2E8B57",
                      "&:hover": { backgroundColor: "#37a768" },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={onDelete}
                    disabled={isLoading}
                    sx={{
                      flex: 1,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </Button>
                </>
              ) : isParticipant ? (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={onLeave}
                  disabled={isLoading}
                  sx={{
                    flex: 1,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Leave
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  onClick={onJoin}
                  disabled={isFull || isLoading}
                  sx={{
                    flex: 1,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Join
                </Button>
              )}
            </>
          ) : (
            <Button
              size="small"
              variant="contained"
              onClick={onJoin}
              disabled={isLoading}
              sx={{
                flex: 1,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#2E8B57",
                "&:hover": { backgroundColor: "#37a768" },
              }}
            >
              Join Event
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};
