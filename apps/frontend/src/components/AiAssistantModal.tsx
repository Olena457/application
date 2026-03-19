
import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
} from "@mui/material";
import { Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AiAssistantModalProps {
  open: boolean;
  onClose: () => void;
  answer: string;
}

const Transition = forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>,
) {
  return (
    <Fade
      ref={ref}
      {...props}
      timeout={{
        enter: 1000,
        exit: 800,
      }}
    />
  );
});

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  open,
  onClose,
  answer,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{
        transition: Transition,
      }}
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { borderRadius: 5 } }}
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Sparkles size={18} color="#1976d2" />
          <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
            AI Assistant Response
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            "& p": { m: 0, mb: 1.5 },
            "& ul, & ol": { m: 0, pl: 2, mb: 1.5 },
            "& li": { mb: 0.5 },
            "& strong": { fontWeight: 700, color: "primary.main" },
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: "text.primary",
          }}
        >
          <ReactMarkdown skipHtml>{answer}</ReactMarkdown>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};