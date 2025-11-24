const express = require("express");
const router = express.Router();
const { createProfileCtrl, getAllProfilesCtrl, getProfileByIdCtrl, updateProfileCtrl, deleteProfileCtrl } = require("./profile.controller");
const validateObjectId = require("../../middlewares/validateObjectId");

router.post("/", createProfileCtrl);
router.get("/", getAllProfilesCtrl);
router.get("/:id", validateObjectId, getProfileByIdCtrl);
router.put("/:id", validateObjectId, updateProfileCtrl);
router.delete("/:id", validateObjectId, deleteProfileCtrl);

module.exports = router;
