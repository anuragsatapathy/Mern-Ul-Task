import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Card } from "@mui/material";
import api from "../api/api";
import EmptyState from "../components/EmptyState";
import { toast } from "react-toastify";

const CVPreview = () => {
  const [html, setHtml] = useState("");
  const [template, setTemplate] = useState("template1");

  const fetchCV = async (tpl = template) => {
    try {
      const res = await api.get(`/cv/preview?template=${tpl}`);
      setHtml(res.data);
    } catch {
      setHtml("");
    }
  };

  useEffect(() => {
    fetchCV();
  }, []);

  const selectTemplate = async (id) => {
    try {
      setTemplate(id);
      await fetchCV(id);
      toast.success("Template selected");
    } catch {
      toast.error("Failed to select template");
    }
  };

  const downloadCV = async () => {
    try {
      const res = await api.get(`/cv/generate?template=${template}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "My_CV.pdf";
      a.click();

      toast.success("CV downloaded");
    } catch {
      toast.error("Failed to download CV");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        CV Templates
      </Typography>

      {/* TEMPLATE SELECTOR */}
      <Box display="flex" gap={2} mb={3}>
        {["template1", "template2"].map((t) => (
          <Card
            key={t}
            onClick={() => selectTemplate(t)}
            sx={{
              p: 2,
              cursor: "pointer",
              border:
                template === t ? "2px solid #1976d2" : "1px solid #ccc",
            }}
          >
            <Typography align="center">
              {t === "template1" ? "Classic CV" : "Modern CV"}
            </Typography>
          </Card>
        ))}
      </Box>

      {!html && (
        <EmptyState text="No CV data available yet. Please add profile, education, experience and skills." />
      )}

      {html && (
        <>
          <Paper
            sx={{
              p: 2,
              border: "1px solid #ddd",
              maxHeight: "75vh",
              overflow: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <Box textAlign="center" mt={3}>
            <Button variant="contained" size="large" onClick={downloadCV}>
              DOWNLOAD CV
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CVPreview;
