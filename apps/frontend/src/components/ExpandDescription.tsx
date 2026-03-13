import { useState } from "react";
import { Typography, Button, Box } from "@mui/material";

interface ExpandDescriptionProps {
  text?: string | null;
}

export const ExpandDescription = ({ text }: ExpandDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const isLongText = text.length > 60;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "unset" : 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "max-height 0.3s ease",
        }}
      >
        {text}
      </Typography>

      {isLongText && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          sx={{
            p: 0,
            mt: 0.5,
            minWidth: "auto",
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "primary.main",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {isExpanded ? "Less" : "Read more..."}
        </Button>
      )}
    </Box>
  );
};
