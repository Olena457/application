
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Sparkles, Send, X } from "lucide-react";
import { useAskAiAssistantMutation } from "../store/api/eventsApi";
import { AiAssistantModal } from "./AiAssistantModal";

export const AiAssistant = () => {
  const [question, setQuestion] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isAborted, setIsAborted] = useState(false);
  const [askAi, { data, isLoading, error, reset }] =
    useAskAiAssistantMutation();

  const promiseRef = useRef<any>(null);

  useEffect(() => {
    if (data?.answer) {
      setOpenModal(true);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    if (error || isAborted) {
      reset();
      setIsAborted(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) return;

    reset();
    setIsAborted(false);

    try {
      const promise = askAi({ question: trimmedQuestion });
      promiseRef.current = promise;
      await promise.unwrap();
      setQuestion("");
    } catch (err: any) {
      if (err.name === "AbortError" || err.status === "FETCH_ERROR") {
        setIsAborted(true);
      }
    } finally {
      promiseRef.current = null;
    }
  };

  const handleCancel = () => {
    if (promiseRef.current) {
      promiseRef.current.abort();
      promiseRef.current = null;
    }
    setIsAborted(true);
    reset();
    setQuestion("");
  };

  return (
    <Paper
      sx={{
        p: 2,
        pb: "15px",
        flex: 1,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: isFocused ? "primary.main" : "divider",
        maxWidth: 500,
        width: "100%",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Sparkles size={20} color="#1e88e5" />
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
          placeholder={isFocused || question ? "" : "Ask about your events..."}
          value={question}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete="off"
          slotProps={{
            htmlInput: {
              maxLength: 150, 
            },
            input: {
              endAdornment: question && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={
                      isLoading
                        ? handleCancel
                        : () => {
                            setQuestion("");
                            reset();
                          }
                    }
                    edge="end"
                    size="small"
                    sx={{ color: isLoading ? "error.main" : "inherit" }}
                  >
                    <X size={18} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              "& fieldset": {
                transition: "border-color 0.2s",
              },
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
            },
            "& input": {
              py: 1,
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={isLoading || !question.trim()}
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            borderRadius: "50%",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#cecbcb",
            color: "white",
            flexShrink: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#ade3f3",
              transform: "scale(1.05)",
            },
            "&.Mui-disabled": {
              bgcolor: "#ebedee",
              color: "action.disabled",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="primary" />
          ) : (
            <Send size={20} color="#1e88e5" />
          )}
        </IconButton>
      </Box>

      {isAborted && !isLoading && (
        <Alert severity="info" sx={{ mt: 1.5, py: 0, bgcolor: "transparent" }}>
          Request stopped by user.
        </Alert>
      )}

      {error && !isLoading && !isAborted && (
        <Alert severity="error" sx={{ mt: 1.5, py: 0 }}>
          Failed to get response.
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