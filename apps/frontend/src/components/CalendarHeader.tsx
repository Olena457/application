import {
  Box,
  Typography,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Views } from "react-big-calendar";
import type { View } from "react-big-calendar";

const DEEP_OCEAN: [string, string] = ["#1A2980", "#1eb4ea"];

interface CalendarHeaderProps {
  date: Date;
  view: View;
  onNavigate: (action: "PREV" | "NEXT") => void;
  onViewChange: (view: View) => void;
  onCreateClick: () => void;
}

export const CalendarHeader = ({
  date,
  view,
  onNavigate,
  onViewChange,
  onCreateClick,
}: CalendarHeaderProps) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "flex-end" },
          mb: 3,
          gap: 2,
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
              mb: 3,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              background: `linear-gradient(135deg, ${DEEP_OCEAN[0]} 10%, ${DEEP_OCEAN[1]} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your event calendar
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onCreateClick}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: { xs: "8px", md: "10px" },
            backgroundImage:
              "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",

            "&:hover": {
              backgroundImage:
                "linear-gradient(to bottom, #0d47a1 0%, #1e88e5 100%)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },

            "&:focus": { outline: "none" },
          }}
        >
          Create Event
        </Button>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
        spacing={2}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <IconButton
            onClick={() => onNavigate("PREV")}
            sx={controlButtonStyle}
          >
            <ChevronLeft size={20} />
          </IconButton>

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              minWidth: { xs: "140px", sm: "180px" },
              textAlign: "center",
            }}
          >
            {format(
              date,
              view === Views.MONTH ? "MMMM yyyy" : "'Week of' MMM d",
            )}
          </Typography>

          <IconButton
            onClick={() => onNavigate("NEXT")}
            sx={controlButtonStyle}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Stack>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && onViewChange(v)}
          sx={toggleGroupStyle}
        >
          <ToggleButton
            sx={{
              flex: 1,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: { xs: "8px", md: "10px" },
              backgroundImage:
                "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)",
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",

              "&:hover": {
                backgroundImage:
                  "linear-gradient(to bottom, #0d47a1 0%, #1e88e5 100%)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },

              "&:focus": { outline: "none" },
            }}
            value={Views.MONTH}
          >
            Month
          </ToggleButton>
          <ToggleButton
            sx={{
              flex: 1,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: { xs: "8px", md: "10px" },
              backgroundImage:
                "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)",
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",

              "&:hover": {
                backgroundImage:
                  "linear-gradient(to bottom, #0d47a1 0%, #1e88e5 100%)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },

              "&:focus": { outline: "none" },
            }}
            value={Views.WEEK}
          >
            Week
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </>
  );
};

const controlButtonStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: 1,
  transition: "all 0.2s ease-in-out",
  width: "36px",
  backgroundColor: "#fff",
  "&:hover": {
    borderColor: "#1976d2",
    color: "#1976d2",
    boxShadow: 3,
  },
};

const toggleGroupStyle = {
  gap: 1,
  width: { xs: "100%", md: "auto" },
  "& .MuiToggleButtonGroup-grouped": {
    flex: { xs: 1, md: "none" },
    border: "1px solid #e5e7eb",
    borderRadius: "8px !important",
    textTransform: "none",
    px: 3,
    py: 0.5,
    boxShadow: 1,
    "&.Mui-selected": {
      backgroundColor: "#1976d2",
      color: "white",
      "&:hover": { backgroundColor: "#0582ff" },
    },
  },
};
