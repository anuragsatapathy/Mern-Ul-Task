const service = require("./task.service");
const responses = require("../../utility/response");

const createTask = async (req, res) => {
  try {
    const result = await service.createTask(req.body, req.user.id);

    if (result.status !== 200) {
      return responses.badRequestResponse(res, result.message);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};


const getTasks = async (req, res) => {
  try {
    const result = await service.getTasks(req.user.id);

    if (result.status !== 200) {
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


const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await service.getTasksByProject(
      projectId,
      req.user.id
    );

    if (result.status !== 200) {
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


const getTaskById = async (req, res) => {
  try {
    const result = await service.getTaskById(
      req.params.id,
      req.user.id
    );

    if (!result?.data) {
      return responses.notFoundResponse(res, "Task not found");
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};


const updateTask = async (req, res) => {
  try {
    const result = await service.updateTask(
      req.params.id,
      req.body,
      req.user.id
    );

    if (result.status !== 200) {
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

const deleteTask = async (req, res) => {
  try {
    const result = await service.deleteTask(
      req.params.id,
      req.user.id
    );

    if (result.status !== 200) {
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

module.exports = {
  createTask,
  getTasks,
  getTasksByProject, 
  getTaskById,
  updateTask,
  deleteTask,
};
