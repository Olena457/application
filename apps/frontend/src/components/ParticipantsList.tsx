import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";

interface Participant {
  id?: string;
  userId?: string;
  user?: { name: string | null };
}

interface ParticipantsListProps {
  participants: Participant[];
}

export const ParticipantsList = ({ participants }: ParticipantsListProps) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
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
        transition: "opacity 0.4s ease",
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
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
      Participants ({participants.length})
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <List sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "450px" }}>
      {participants.length > 0 ? (
        participants.map((p) => (
          <ListItem key={p.id ?? p.userId} disableGutters sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: "24px" }}>
              <Box
                sx={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={p.user?.name || "Anonymous User"}
              slotProps={{ primary: { variant: "body1", fontWeight: 500 } }}
            />
          </ListItem>
        ))
      ) : (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No participants yet.
          </Typography>
        </Box>
      )}
    </List>
  </Paper>
);
