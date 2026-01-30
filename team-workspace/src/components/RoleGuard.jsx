import useAuth from "../auth/useAuth";

const RoleGuard = ({ allow = [], role: workspaceRole, children }) => {
  const { role: authRole } = useAuth();

  const effectiveRole = (workspaceRole || authRole)?.toLowerCase();

  if (!effectiveRole) return null;

  const allowed = allow.map((r) => r.toLowerCase());

  if (!allowed.includes(effectiveRole)) return null;

  return children;
};

export default RoleGuard;
