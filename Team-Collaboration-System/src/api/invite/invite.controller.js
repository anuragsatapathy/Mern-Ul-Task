const service = require("./invite.service");
const responses = require("../../utility/response");

const sendInvite = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspaceId = req.params.id;

    await service.sendInvite({
      email,
      role,
      workspaceId,
      invitedBy: req.user.id,
    });

    return responses.successResponse(res, null, "Invite sent");
  } catch (err) {
    console.error("SEND INVITE ERROR:", err);
    return responses.internalFailureResponse(res, err);
  }
};

const validateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    const result = await service.validateInvite({
      workspaceId,
      userId: req.user.id, 
    });

    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, 400);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.error("VALIDATE INVITE ERROR:", err);
    return responses.internalFailureResponse(res, err);
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    const result = await service.acceptInvite({
      workspaceId,
      userId: req.user.id, 
    });

    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, 400);
    }

    return responses.successResponse(res, result.data, "Invite accepted");
  } catch (err) {
    console.error("ACCEPT INVITE ERROR:", err);
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  sendInvite,
  validateInvite,
  acceptInvite,
};
