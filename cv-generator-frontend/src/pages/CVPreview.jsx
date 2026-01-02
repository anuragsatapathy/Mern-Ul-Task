import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import api from "../api/api";
import EmptyState from "../components/EmptyState";
import { toast } from "react-toastify";

const CVPreview = () => {
  const [html, setHtml] = useState("");

  const fetchCV = async () => {
    try {
      const res = await api.get("/cv/preview");
      setHtml(res.data);
    } catch {
      setHtml("");
    }
  };

  useEffect(() => {
    fetchCV();
  }, []);

  const downloadCV = async () => {
    try {
      const res = await api.get("/cv/generate", {
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
        CV Preview
      </Typography>

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
