const express = require("express");
const router = express.Router();

const cvController = require("./cv.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.get("/preview", jwtValidation, cvController.previewCV);
router.get("/generate", jwtValidation, cvController.generateCV);

module.exports = router;
