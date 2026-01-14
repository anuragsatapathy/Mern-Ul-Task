const express = require("express");
const router = express.Router();

const certificateController = require("./certificate.controller");
const universalAuth = require("../../middlewares/universalAuth");

// Create
router.post("/", universalAuth, certificateController.createCertificate);

// Get All
router.get("/", universalAuth, certificateController.getCertificates);

// Get by ID
router.get("/:id", universalAuth, certificateController.getCertificateById);

// Update
router.put("/:id", universalAuth, certificateController.updateCertificate);

// Delete
router.delete("/:id", universalAuth, certificateController.deleteCertificate);

module.exports = router;
