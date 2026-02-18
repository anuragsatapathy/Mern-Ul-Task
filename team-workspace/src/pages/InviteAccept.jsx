import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import useAuth from "../auth/useAuth";
import { showError, showSuccess } from "../utils/toast";

const InviteAccept = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { token: authToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState(null);

  
  useEffect(() => {
    const validateInvite = async () => {
      try {
        const res = await axios.get(`/invites/${token}`);
        setInvite(res.data.data);
      } catch (err) {
        showError("Invalid or expired invite");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    validateInvite();
  }, [token, navigate]);

  const acceptInvite = async () => {
    if (!authToken) {
      navigate(`/login?invite=${token}`);
      return;
    }

    try {
      await axios.post(
        "/invites/accept",
        { token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      localStorage.setItem("workspaceRole", invite.role.toLowerCase());

      showSuccess("Workspace joined successfully");
      navigate("/workspaces");
    } catch {
      showError("Failed to accept invite");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invite) return null;

  const isAlreadyAccepted = invite.status === "ACCEPTED"; 

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, textAlign: "center" }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Workspace Invitation
      </Typography>

      <Typography mb={2}>
        You have been invited to join <b>{invite.workspaceName}</b> as{" "}
        <b>{invite.role}</b>
      </Typography>

      {isAlreadyAccepted ? (
        <Typography color="success.main" fontWeight={600}>
           You have already accepted this invitation.
        </Typography>
      ) : (
        <Button variant="contained" onClick={acceptInvite}>
          Accept Invitation
        </Button>
      )}
    </Box>
  );
};

export default InviteAccept;
