const express = require("express");
const router = express.Router();

const profileController = require("./profile.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, profileController.saveProfile);
router.get("/", jwtValidation, profileController.getProfile);


router.delete("/", jwtValidation, profileController.deleteProfile);

module.exports = router;
