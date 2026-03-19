import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus fullWidth

      sx={{ "& .MuiDialog-paper": { borderRadius: 5 } }}>
      <DialogTitle sx={{ fontWeight: "bold" }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
          sx={{ borderRadius: { xs: "8px", md: "10px" } }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
          disabled={isLoading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: { xs: "8px", md: "10px" },
            backgroundImage:
              "linear-gradient(to bottom, #E15B5B 0%, #C62828 100%)",
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",

            "&:hover": {
              backgroundImage:
                "linear-gradient(to bottom, #C62828 0%, #E15B5B 100%)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },

            "&:focus": { outline: "none" },
          }}
        >
          {isLoading ? "Processing..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
