const mongoose = require("mongoose");
const { errorResponse } = require("../utility/responses");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, "Invalid ID", 400);
  }
  next();
};

module.exports = validateObjectId;
