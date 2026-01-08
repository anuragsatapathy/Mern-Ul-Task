const certificateService = require("./certificate.service");
const responses = require("../../utility/response");

const createCertificate = async (req, res) => {
  try {
    const result = await certificateService.createCertificate({
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

const getCertificates = async (req, res) => {
  try {
    const result = await certificateService.getCertificates({
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

const getCertificateById = async (req, res) => {
  try {
    const result = await certificateService.getCertificateById(req.params.id);

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateCertificate = async (req, res) => {
  try {
    const result = await certificateService.updateCertificate(
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

const deleteCertificate = async (req, res) => {
  try {
    const result = await certificateService.deleteCertificate(req.params.id);

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
};
