
export const canManageWorkspace = (role) =>
  role === "owner" || role === "admin";

export const canManageProjects = (role) =>
  role === "owner" || role === "admin";


export const canManageTasks = (role) =>
  role === "owner" || role === "admin";


export const canEditTask = (role, isAssigned) =>
  role === "owner" || role === "admin" || isAssigned;


export const canViewTask = () => true;
