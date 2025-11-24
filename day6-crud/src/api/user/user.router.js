const express = require("express");
const router = express.Router();
const { createUserCtrl, getAllUsersCtrl, getUserByIdCtrl, updateUserCtrl, deleteUserCtrl } = require("./user.controller");
const validateObjectId = require("../../middlewares/validateObjectId");

router.post("/", createUserCtrl);
router.get("/", getAllUsersCtrl);
router.get("/:id", validateObjectId, getUserByIdCtrl);
router.put("/:id", validateObjectId, updateUserCtrl);
router.delete("/:id", validateObjectId, deleteUserCtrl);

module.exports = router;
