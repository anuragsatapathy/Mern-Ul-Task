const express = require("express");
const router = express.Router();

const listController = require("./list.controller");

// Create List
router.post("/", listController.createList);

// Get All Lists
router.get("/", listController.getLists);

// Get List by ID
router.get("/:id", listController.getListById);

// Update List
router.put("/:id", listController.updateList);

// Delete List
router.delete("/:id", listController.deleteList);

module.exports = router;



