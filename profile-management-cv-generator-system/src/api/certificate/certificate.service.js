const path = require("path");
const Certificate = require(
  path.resolve(__dirname, "../../models/certificate.model")
);

const createCertificate = async (data) => {
  try {
    const payload = { ...data };

    if (!data.validTill) {
      payload.validTill = null;
    }

    const certificate = new Certificate(payload);
    await certificate.save();

    return {
      status: 200,
      message: "Certificate created successfully!",
      data: certificate,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getCertificates = async ({ userId }) => {
  try {
    const certificates = await Certificate.find({
      userId,
      isDeleted: false,
    });

    return { status: 200, data: certificates };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getCertificateById = async (id) => {
  try {
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return { status: 404, message: "Certificate not found" };
    }

    return { status: 200, data: certificate };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const updateCertificate = async (id, data) => {
  try {
    const updateData = { ...data };

    if (!data.validTill) {
      updateData.validTill = null;
    }

    const certificate = await Certificate.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return {
      status: 200,
      message: "Certificate updated successfully!",
      data: certificate,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const deleteCertificate = async (id) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    return {
      status: 200,
      message: "Certificate deleted successfully!",
      data: certificate,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
};
