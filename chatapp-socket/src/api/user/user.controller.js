const service = require("./user.service");
const responses = require("../../utility/response");

const getUsers = async (req, res) => {
  try {
    const data = await service.getUsers();

    return responses.successResponse(res, data, "Users fetched successfully");
  } catch (e) {
    console.log("GET USERS ERROR:", e); // 👈 debug log
    return responses.internalFailureResponse(res, e.message);
  }
};

module.exports = { getUsers };
