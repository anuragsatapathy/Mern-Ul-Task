import { Box, Typography } from "@mui/material";

export default function EmptyState({ text }) {
  return (
    <Box
      sx={{
        mt: 3,
        p: 4,
        border: "2px dashed #cbd5e1",
        borderRadius: 2,
        textAlign: "center",
        color: "#64748b",
        bgcolor: "#f8fafc",
      }}
    >
      <Typography fontSize={15}>{text}</Typography>
    </Box>
  );
}
