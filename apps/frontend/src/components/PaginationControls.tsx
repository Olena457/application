import { Pagination, Box , } from "@mui/material";

interface Props {
  page: number;
  count: number;
  onChange: (page: number) => void;
}

export const PaginationControls = ({ page, count, onChange }: Props) => {
  if (count <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
      <Pagination
        count={count}
        page={page}
        onChange={(_, value) => onChange(value)}
        color="primary"
        variant="outlined"
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25)",
            borderColor: "#1eb4ea",
            borderRadius: "4px",
          },
        }}
      />
    </Box>
  );
};
