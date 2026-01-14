const express = require("express");
const router = express.Router();

const cvController = require("./cv.controller");
const universalAuth = require("../../middlewares/universalAuth");

router.get("/preview", universalAuth, cvController.previewCV);
router.get("/generate", universalAuth, cvController.generateCV);

module.exports = router;
