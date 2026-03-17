
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Sparkles, Send } from "lucide-react";
import { useAskAiAssistantMutation } from "../store/api/eventsApi";
import { AiAssistantModal } from "./AiAssistantModal";

export const AiAssistant = () => {
  const [question, setQuestion] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [askAi, { data, isLoading, error }] = useAskAiAssistantMutation();

  useEffect(() => {
    if (data?.answer) {
      setOpenModal(true);
    }
  }, [data]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) return;

    try {
      await askAi({ question: trimmedQuestion }).unwrap();
      setQuestion("");
    } catch (err) {
      console.error("AI Error:", err);
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Sparkles size={20} color="#1976d2" />
        <Typography variant="subtitle1" fontWeight="bold">
          AI Event Assistant
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 1 }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Ask about your events..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
        />
        <IconButton
          type="submit"
          disabled={isLoading || !question.trim()}
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            p: 1,
            borderRadius: "50%",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "primary.main",
            color: "white",
            transition: "transform 0.2s ease, background-color 0.2s ease",

            "&:hover": {
              bgcolor: "primary.dark",
              transform: "scale(1.1)",
            },

            "&:focus": {
              bgcolor: "secondary.main",
            },

            "&.Mui-disabled": {
              bgcolor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <Send size={20} />
          )}
        </IconButton>
      </Box>

      {error && !isLoading && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Failed to get response. Please try again later.
        </Alert>
      )}

      <AiAssistantModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        answer={data?.answer || ""}
      />
    </Paper>
  );
};
