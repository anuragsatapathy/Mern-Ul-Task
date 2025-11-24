const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require("./user.service");
const { successResponse, errorResponse } = require("../../utility/responses");

const createUserCtrl = async (req, res) => {
  try {
    const user = await createUser(req.body);
    successResponse(res, user, "User created successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getAllUsersCtrl = async (req, res) => {
  try {
    const users = await getAllUsers(req.query.search);
    successResponse(res, users);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getUserByIdCtrl = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updateUserCtrl = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) return errorResponse(res, "User not found", 404);
    successResponse(res, user, "User updated successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const deleteUserCtrl = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    successResponse(res, user, "User deleted successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = { createUserCtrl, getAllUsersCtrl, getUserByIdCtrl, updateUserCtrl, deleteUserCtrl };
