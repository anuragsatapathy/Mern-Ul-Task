import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import useAuth from "../auth/useAuth";
import { showError, showSuccess } from "../utils/toast";

const InviteAccept = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token: authToken, user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const workspaceId = queryParams.get("workspaceId");

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState(null);

  // ✅ Validate invite (NO TOKEN, email + workspaceId)
  useEffect(() => {
    const validateInvite = async () => {
      if (!authToken) {
        navigate(`/login?inviteWorkspace=${workspaceId}`);
        return;
      }

      try {
        const res = await axios.post(
          "/invites/validate",
          { workspaceId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setInvite(res.data.data);
      } catch (err) {
        showError("Invalid or expired invite");
        navigate("/workspaces");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      validateInvite();
    } else {
      showError("Invalid invitation link");
      navigate("/workspaces");
    }
  }, [workspaceId, authToken, navigate]);

  // ✅ Accept invite
  const acceptInvite = async () => {
    try {
      const res = await axios.post(
        "/invites/accept",
        { workspaceId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const { role } = res.data.data;

      localStorage.setItem("activeWorkspace", workspaceId);
      localStorage.setItem("workspaceRole", role);

      showSuccess("Workspace joined successfully");
      navigate("/workspaces");
    } catch (err) {
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

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, textAlign: "center" }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Workspace Invitation
      </Typography>

      <Typography mb={2}>
        You have been invited to join <b>{invite.workspaceName}</b> as{" "}
        <b>{invite.role}</b>
      </Typography>

      <Button variant="contained" onClick={acceptInvite}>
        Accept Invitation
      </Button>
    </Box>
  );
};

export default InviteAccept;
