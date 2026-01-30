const prisma = require("../../config/db");
const nodemailer = require("nodemailer");

const VALID_ROLES = ["OWNER", "ADMIN", "MEMBER"];

const sendInvite = async ({ email, role, workspaceId, invitedBy }) => {
  if (!email || !workspaceId) {
    throw new Error("email and workspaceId are required");
  }

  const normalizedRole = role?.toUpperCase() || "MEMBER";

  if (!VALID_ROLES.includes(normalizedRole)) {
    throw new Error("Invalid role");
  }

  // Check workspace
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check inviter is a member
  const inviter = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: invitedBy,
        workspaceId,
      },
    },
  });

  if (!inviter) {
    throw new Error("You are not a member of this workspace");
  }

  // Prevent duplicate active invite
  const existingInvite = await prisma.workspaceInvite.findFirst({
    where: {
      email,
      workspaceId,
      isAccepted: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (existingInvite) {
    return { status: 200 };
  }

  // Create invite 
  await prisma.workspaceInvite.create({
    data: {
      email,
      role: normalizedRole,
      workspaceId,
      isAccepted: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });


  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return { status: 200 };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const inviteLink = `http://localhost:5173/invite?workspaceId=${workspaceId}`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Workspace Invitation",
    html: `
      <p>
        You have been invited to join <b>${workspace.name}</b> as
        <b>${normalizedRole}</b>
      </p>
      <a href="${inviteLink}">Accept Invitation</a>
    `,
  });

  return { status: 200 };
};

const validateInvite = async ({ workspaceId, userId }) => {
  const invite = await prisma.workspaceInvite.findFirst({
    where: {
      workspaceId,
      isAccepted: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      workspace: {
        select: { name: true },
      },
    },
  });

  if (!invite) {
    return { status: 400, message: "Invalid or expired invite" };
  }

  return {
    status: 200,
    data: {
      workspaceName: invite.workspace.name,
      role: invite.role,
    },
  };
};

const acceptInvite = async ({ workspaceId, userId }) => {
  const invite = await prisma.workspaceInvite.findFirst({
    where: {
      workspaceId,
      isAccepted: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!invite) {
    return { status: 400, message: "Invalid or expired invite" };
  }

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    update: {
      role: invite.role,
    },
    create: {
      userId,
      workspaceId,
      role: invite.role,
    },
  });

  await prisma.workspaceInvite.update({
    where: { id: invite.id },
    data: { isAccepted: true },
  });

  return {
    status: 200,
    data: {
      workspaceId,
      role: invite.role.toLowerCase(),
    },
  };
};

module.exports = {
  sendInvite,
  validateInvite,
  acceptInvite,
};
