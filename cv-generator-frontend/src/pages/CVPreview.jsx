import { Button, Card, Typography } from "@mui/material";

const CVPreview = () => {
  const download = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/cv/generate",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Failed to download CV");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "My_CV.pdf"; 
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        CV Preview
      </Typography>

      <Card sx={{ maxWidth: 800, mt: 2, p: 4 }}>
        <Typography>
          Click below to generate and download your CV as a PDF.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={download}
        >
          Download CV
        </Button>
      </Card>
    </>
  );
};

export default CVPreview;
