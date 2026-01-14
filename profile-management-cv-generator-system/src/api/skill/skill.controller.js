const skillService = require("./skill.service");
const responses = require("../../utility/response");

const addSkill = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await skillService.addSkill(userId, req.body);

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.error("Add skill error:", err);
    return res.status(500).json({ message: "Failed to save skills" });
  }
};

const getSkill = async (req, res) => {
  try {
    const { offset = 0, limit = 10 } = req.query;
    const userId = req.user.id;

    const result = await skillService.getSkill(userId, offset, limit);

    return responses.paginatedResponse(
      res,
      result.data,
      result.total,
      offset
    );
  } catch (err) {
    console.error("Get skill error:", err);
    return res.status(500).json({ message: "Failed to fetch skills" });
  }
};

const updateSkill = async (req, res) => {
  try {
    const result = await skillService.updateSkill(
      req.params.id,
      req.body
    );
    return responses.successResponse(res, result.data);
  } catch (err) {
    console.error("Update skill error:", err);
    return res.status(500).json({ message: "Failed to update skill" });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const result = await skillService.deleteSkill(req.params.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    console.error("Delete skill error:", err);
    return res.status(500).json({ message: "Failed to delete skill" });
  }
};

module.exports = {
  addSkill,
  getSkill,
  updateSkill,
  deleteSkill,
};
