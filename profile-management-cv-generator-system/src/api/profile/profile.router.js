const express = require("express");
const router = express.Router();
const multer = require("multer");

const profileController = require("./profile.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  jwtValidation,
  upload.single("profileImage"),
  profileController.saveProfile
);

router.get("/", jwtValidation, profileController.getProfile);
router.delete("/", jwtValidation, profileController.deleteProfile);

module.exports = router;
