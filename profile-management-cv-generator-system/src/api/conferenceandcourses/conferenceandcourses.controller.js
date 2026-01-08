const service = require("./conferenceandcourses.service");
const responses = require("../../utility/response");

const createConferenceAndCourse = async (req, res) => {
  try {
    const result = await service.createConferenceAndCourse({
      ...req.body,
      userId: req.user.id,
    });

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getConferenceAndCourses = async (req, res) => {
  try {
    const result = await service.getConferenceAndCourses({
      userId: req.user.id,
    });

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getConferenceAndCourseById = async (req, res) => {
  try {
    const result = await service.getConferenceAndCourseById(req.params.id);

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateConferenceAndCourse = async (req, res) => {
  try {
    const result = await service.updateConferenceAndCourse(
      req.params.id,
      req.body
    );

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const deleteConferenceAndCourse = async (req, res) => {
  try {
    const result = await service.deleteConferenceAndCourse(req.params.id);

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createConferenceAndCourse,
  getConferenceAndCourses,
  getConferenceAndCourseById,
  updateConferenceAndCourse,
  deleteConferenceAndCourse,
};
