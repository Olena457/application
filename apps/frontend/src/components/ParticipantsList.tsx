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
    sx={{
      p: 3,
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
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
