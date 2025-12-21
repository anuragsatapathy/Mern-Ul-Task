const userService = require("./user.service");
const responses = require("../../utility/response");

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);

    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers();
    return responses.successResponse(res, result);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    if (!result) {
      return responses.notFoundResponse(res, "User not found");
    }
    return responses.successResponse(res, result);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    if (!result) {
      return responses.notFoundResponse(res, "User not found");
    }
    return responses.successResponse(res, result);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (!result) {
      return responses.notFoundResponse(res, "User not found");
    }
    return responses.successResponse(res, {});
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
