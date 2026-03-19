import { Box, Skeleton } from "@mui/material";

export const EventDetailsSkeleton = () => (
  <Box
    sx={{
      mt: 4,
      display: "flex",
      flexDirection: { xs: "column", "@media (min-width:768px)": "row" },
      gap: 3,
    }}
  >
    <Box sx={{ flex: 2 }}>
      <Skeleton
        variant="rectangular"
        height={400}
        sx={{ borderRadius: 2, width: "100%" }}
      />
    </Box>

    <Box sx={{ flex: 1 }}>
      <Skeleton
        variant="rectangular"
        height={400}
        sx={{ borderRadius: 2, width: "100%" }}
      />
    </Box>
  </Box>
);
