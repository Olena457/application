import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Collapse,
  Alert,
} from "@mui/material";
import { Sparkles, Send } from "lucide-react";
import { useAskAiAssistantMutation } from "../store/api/eventsApi";

export const AiAssistant = () => {
  const [question, setQuestion] = useState("");
  const [askAi, { data, isLoading, error }] = useAskAiAssistantMutation();

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
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Sparkles size={20} color="#1976d2" />
        <Typography variant="subtitle1" fontWeight="bold">
          AI Event Assistant
        </Typography>
      </Box>

      {/* Input Form */}
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
          color="primary"
          disabled={isLoading || !question.trim()}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
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

      {/* Response Area */}
      <Box sx={{ mt: data?.answer || error ? 2 : 0 }}>
        <Collapse in={!!data?.answer && !isLoading}>
          {data?.answer && (
            <Box
              sx={{
                p: 2,
                bgcolor: "action.hover",
                borderRadius: 1,
                borderLeft: "4px solid",
                borderColor: "primary.main",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
                gutterBottom
              >
                Assistant:
              </Typography>
              <Typography variant="body2">{data.answer}</Typography>
            </Box>
          )}
        </Collapse>

        {error && !isLoading && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Failed to get response. Please try again later.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};
