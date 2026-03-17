import { Box, Skeleton } from "@mui/material";

interface EventsSkeletonProps {
  count?: number;
}

export const EventsSkeleton = ({ count = 8 }: EventsSkeletonProps) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={250}
          sx={{ flex: "1 1 300px", borderRadius: 2 }}
        />
      ))}
    </Box>
  );
};
