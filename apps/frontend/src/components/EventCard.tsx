
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Chip,
  Stack,
} from "@mui/material";
import { Calendar, Clock4, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "../types/event";
import { ExpandDescription } from "./ExpandDescription";
import { GradientButton } from "./GradientButton"; 

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

const BLUE: [string, string] = ["#1e88e5", "#0d47a1"];
const GRAY: [string, string] = ["#c0b8b8", "#918c8c"];
const GREEN: [string, string] = ["#ffb300", "#f57c00"];
const CORAL: [string, string] = ["#f57c7c", "#b93838"];


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
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(30, 136, 229, 0.20) 0%, rgba(255, 255, 255, 0) 50%)",
          opacity: 0,
          transition: "opacity 0.4s ease, transform 0.4s ease",
          zIndex: 0,
        },
        "&:hover, &:focus-within": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          "&::before": {
            opacity: 1,
          },
        },

        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, px: 2, py: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            display: "inline-flex",
            width: "fit-content",
            color: "#1e88e5",
            mb: 1,
          }}
        >
          {event.title}
        </Typography>

        <ExpandDescription text={event.description ?? ""} />

        <Box sx={iconRowStyle}>
          <Calendar size={16} color="#828484" />
          <Typography variant="body2">
            {format(new Date(event.date), "MMM dd, yyyy")}
          </Typography>
        </Box>
        <Box sx={iconRowStyle}>
          <Clock4 size={16} color="#828484" />
          <Typography variant="body2">
            {format(new Date(event.date), "p")}
          </Typography>
        </Box>
        <Box sx={iconRowStyle}>
          <MapPin size={16} color="#828484" />
          <Typography variant="body2">{event.location}</Typography>
        </Box>
        <Box sx={{ ...iconRowStyle, mt: 1 }}>
          <Users size={16} color="#828484" />
          <Typography variant="body2">
            {count} {capacity ? `/ ${capacity}` : ""} participants
          </Typography>
        </Box>
      </CardContent>
      {event.tags && event.tags.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{
            mb: 2,
            columnGap: 0.1,
            rowGap: 0.5,
            px: 2,
            py: 0.25,
          }}
        >
          {event.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: "20px",
                bgcolor: "#f8f9fa",
                border: "none",
                color: "#828484",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            />
          ))}
        </Stack>
      )}

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: "flex", gap: 1, width: "100%", flexWrap: "wrap" }}>
          <GradientButton colors={BLUE} onClick={onView}>
            {viewLabel}
          </GradientButton>

          {isLoggedIn ? (
            <>
              {isOrganizer ? (
                <>
                  <GradientButton colors={GREEN} onClick={onEdit}>
                    Edit
                  </GradientButton>
                  <GradientButton
                    colors={CORAL}
                    onClick={onDelete}
                    disabled={isLoading}
                  >
                    Delete
                  </GradientButton>
                </>
              ) : isParticipant ? (
                <GradientButton
                  colors={GRAY}
                  onClick={onLeave}
                  disabled={isLoading}
                >
                  Leave
                </GradientButton>
              ) : (
                <GradientButton
                  colors={BLUE}
                  onClick={onJoin}
                  disabled={isFull || isLoading}
                >
                  Join
                </GradientButton>
              )}
            </>
          ) : (
            <GradientButton colors={BLUE} onClick={onJoin}>
              Join Event
            </GradientButton>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};