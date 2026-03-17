import { Box, Alert, AlertTitle, Button } from "@mui/material";
import { RefreshCw } from "lucide-react";

interface EventsErrorProps {
  onRetry: () => void;
}

export const EventsError = ({ onRetry }: EventsErrorProps) => (
  <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
    <Alert
      severity="error"
      variant="outlined"
      action={
        <Button
          color="inherit"
          size="small"
          onClick={onRetry}
          startIcon={<RefreshCw size={16} />}
        >
          Retry
        </Button>
      }
    >
      <AlertTitle>Error Loading Events</AlertTitle>
      Something went wrong while fetching the events list.
    </Alert>
  </Box>
);
