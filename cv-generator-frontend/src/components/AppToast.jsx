import { Snackbar, Alert } from "@mui/material";

export default function AppToast({ toast, setToast }) {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => setToast({ ...toast, open: false })}
    >
      <Alert severity={toast.type} variant="filled">
        {toast.msg}
      </Alert>
    </Snackbar>
  );
}
