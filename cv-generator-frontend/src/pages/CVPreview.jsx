import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api/api";
import { toast } from "react-toastify";

import CV1PreviewImg from "../assets/CV 1.png";
import CV2PreviewImg from "../assets/CV 2.png";
import CV3PreviewImg from "../assets/CV 3.png";

const templateLabels = {
  template1: "CV 1",
  template2: "CV 2",
  template3: "CV 3",
};

const CVPreview = () => {
  const [html, setHtml] = useState("");
  const [template, setTemplate] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [previews, setPreviews] = useState({
    template1: "",
    template2: "",
    template3: "",
  });

  const templateImageMap = {
    template1: CV1PreviewImg,
    template2: CV2PreviewImg,
    template3: CV3PreviewImg,
  };

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
      toast.error("Failed to load CV data");
    }
  };

  useEffect(() => {
    fetchAllPreviews();
  }, []);

  const handleOpenPreview = (id) => {
    setTemplate(id);
    setHtml(previews[id]);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const downloadCV = async () => {
    if (!template) return;
    try {
      const res = await api.get(`/cv/generate?template=${template}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateLabels[template]}.pdf`;
      a.click();
      toast.success("CV downloaded successfully");
    } catch {
      toast.error("Failed to download CV");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: 4 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, color: "#1e293b" }}>
        Select a Design
      </Typography>

      <Grid container spacing={4} justifyContent="flex-start">
        {[
          { id: "template1", label: "CV 1" },
          { id: "template2", label: "CV 2" },
          { id: "template3", label: "CV 3" },
        ].map((t) => (
          <Grid item key={t.id}>
            <Box textAlign="center">
              <Card
                onClick={() => handleOpenPreview(t.id)}
                sx={{
                  width: 220, 
                  height: 310,
                  cursor: "pointer",
                  position: "relative",
                  border: template === t.id ? "3px solid #2563eb" : "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={templateImageMap[t.id]}
                  alt={t.label}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", 
                    display: "block",
                    bgcolor: "#fff"
                  }}
                />
              </Card>

              <Typography
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  fontSize: "14px",
                  color: template === t.id ? "#2563eb" : "#64748b",
                }}
              >
                {t.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

     
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
      // maxWidth="sm" 
        fullWidth
        //scroll="body"
        PaperProps={{
          sx: { borderRadius: "12px",  maxHeight:"90vh",maxWidth:"900px"}
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            CV Preview: {templateLabels[template]}
          </Typography>
          <IconButton onClick={handleClosePreview} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ bgcolor: "#f1f5f9", p: 2 }}>
          <Paper
            elevation={2}
            sx={{
              bgcolor: "#fff",
              mx: "auto",
              width: "100%",
              overflow: "hidden",
              position: "relative",
              height: "fit-content"
            }}
          >
            <Box sx={{ 
              transform: "scale(0.70)", 
              transformOrigin: "top center",
              width: "138.8%", 
              margin: "0 -19.4%", 
              mb: -20,
            }}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClosePreview}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={downloadCV}
            sx={{
              bgcolor: "#2563eb",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CVPreview;