const express = require("express");
const router = express.Router();

const certificateController = require("./certificate.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

// Create
router.post("/", jwtValidation, certificateController.createCertificate);

// Get All
router.get("/", jwtValidation, certificateController.getCertificates);

// Get by ID
router.get("/:id", jwtValidation, certificateController.getCertificateById);

// Update
router.put("/:id", jwtValidation, certificateController.updateCertificate);

// Delete
router.delete("/:id", jwtValidation, certificateController.deleteCertificate);

module.exports = router;
