import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Card, Grid } from "@mui/material";
import api from "../api/api";
import { toast } from "react-toastify";

const CVPreview = () => {
  const [html, setHtml] = useState("");
  const [template, setTemplate] = useState(null);
  const [previews, setPreviews] = useState({
    template1: "",
    template2: "",
    template3: "",
  });

  // Fetch all previews
  const fetchAllPreviews = async () => {
    try {
      const [res1, res2, res3] = await Promise.all([
        api.get("/cv/preview?template=template1"),
        api.get("/cv/preview?template=template2"),
        api.get("/cv/preview?template=template3"),
      ]);

      setPreviews({
        template1: res1.data,
        template2: res2.data,
        template3: res3.data,
      });
    } catch (err) {
      console.error("Failed to fetch previews", err);
      toast.error("Failed to load CV previews");
    }
  };

  useEffect(() => {
    fetchAllPreviews();
  }, []);

  const selectTemplate = (id) => {
    try {
      setTemplate(id);
      setHtml(previews[id]);
      toast.success("Template Selected");
    } catch {
      toast.error("Failed to load template");
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: 4 }}>
      {/* CV CARDS */}
      <Grid container spacing={6} justifyContent="flex-start">
        {[
          { id: "template1", label: "CV 1" },
          { id: "template2", label: "CV 2" },
          { id: "template3", label: "CV 3" },
        ].map((t) => (
          <Grid item key={t.id}>
            <Box textAlign="center">
              <Card
                onClick={() => selectTemplate(t.id)}
                sx={{
                  width: 190,
                  height: 270,
                  cursor: "pointer",
                  border:
                    template === t.id
                      ? "2px solid #2563eb"
                      : "1px solid #e5e7eb",
                  boxShadow:
                    template === t.id
                      ? "0 10px 22px rgba(37,99,235,0.25)"
                      : "0 6px 14px rgba(0,0,0,0.12)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  transition: "0.25s",
                  background: "#fff",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 14px 26px rgba(0,0,0,0.18)",
                  },
                }}
              >
                {/* CV PREVIEW */}
                <Box
                  sx={{
                    transform: "scale(0.22)",
                    transformOrigin: "top left",
                    width: "820px",
                    height: "1160px",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: previews[t.id],
                    }}
                  />
                </Box>
              </Card>

              <Typography
                sx={{
                  mt: 1.5,
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#111",
                }}
              >
                {t.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* FULL PREVIEW */}
      {template && html && (
        <Box mt={8}>
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                mb: 4,
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </Paper>

            <Box textAlign="center">
              <Button
                variant="contained"
                onClick={downloadCV}
                sx={{
                  bgcolor: "#2563eb",
                  px: 7,
                  py: 1.5,
                  borderRadius: "8px",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                Download CV
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CVPreview;
