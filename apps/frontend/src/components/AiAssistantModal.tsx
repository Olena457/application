import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AiAssistantModalProps {
  open: boolean;
  onClose: () => void;
  answer: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  open,
  onClose,
  answer,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          sx={{ borderRadius: "8px" }}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};
