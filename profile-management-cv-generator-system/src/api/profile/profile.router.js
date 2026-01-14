const express = require("express");
const router = express.Router();
const multer = require("multer");

const profileController = require("./profile.controller");
const universalAuth = require("../../middlewares/universalAuth");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  universalAuth,
  upload.single("profileImage"),
  profileController.saveProfile
);

router.get("/", universalAuth, profileController.getProfile);
router.delete("/", universalAuth, profileController.deleteProfile);

module.exports = router;
