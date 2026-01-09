import { Box, Card, Typography } from "@mui/material";

const CVTemplateSelector = ({ selected, onSelect }) => {
  const templates = [
    { id: "template1", name: "Cv 1" },
    { id: "template2", name: "Cv 2" },
    { id: "template3", name: "Cv 3" },
  ];

  return (
    <Box display="flex" gap={2}>
      {templates.map((t) => (
        <Card
          key={t.id}
          onClick={() => onSelect(t.id)}
          sx={{
            p: 2,
            cursor: "pointer",
            border: selected === t.id ? "2px solid #1976d2" : "1px solid #ccc",
          }}
        >
          <Typography>{t.name}</Typography>
        </Card>
      ))}
    </Box>
  );
};

export default CVTemplateSelector;
