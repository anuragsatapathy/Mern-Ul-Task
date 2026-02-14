const prisma = require("../../config/db");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


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
    const existingMember = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      user: {
        email,
      },
    },
  });

  if (existingMember) {
    return { status: 200 }; // user already joined, do not create new invite
  }
const token = crypto.randomUUID();

  // Create invite 
  await prisma.workspaceInvite.create({
    data: {
      email,
      role: normalizedRole,
      token,
      workspaceId,
      //isAccepted: false,
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

    const inviteLink = `http://localhost:5173/invite/${token}`;

  //const inviteLink = `http://localhost:5173/invite?workspaceId=${workspaceId}`;

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

const validateInvite = async ({ token }) => {
  const invite = await prisma.workspaceInvite.findUnique({
    where: { token },
    include: {
      workspace: { select: { name: true } },
    },
  });

  console.log('invite', invite)

  if (!invite || invite.expiresAt < new Date()) {
    return { status: 400, message: "Invalid or expired invite" };
  }

  return {
    status: 200,
    data: {
      workspaceId: invite.workspaceId,
      workspaceName: invite.workspace.name,
      role: invite.role.toLowerCase(),
      isAccepted: invite.isAccepted,
    },
  };
};


const acceptInvite = async ({ token, userId }) => {
  const invite = await prisma.workspaceInvite.findUnique({
    where: { token },
  });

  console.log('accpet ionvite', invite)

  if (!invite || invite.expiresAt < new Date()) {
    return { status: 400, message: "Invalid or expired invite" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user.email !== invite.email) {
    return { status: 403, message: "Invite email mismatch" };
  }

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: invite.workspaceId,
      },
    },
    update: { role: invite.role },
    create: {
      userId,
      workspaceId: invite.workspaceId,
      role: invite.role,
    },
  });

  await prisma.workspaceInvite.update({
    where: { token },
    data: { isAccepted: true },
  });

  return {
    status: 200,
    data: {
      workspaceId: invite.workspaceId,
      role: invite.role.toLowerCase(),
    },
  };
};


module.exports = {
  sendInvite,
  validateInvite,
  acceptInvite,
};
