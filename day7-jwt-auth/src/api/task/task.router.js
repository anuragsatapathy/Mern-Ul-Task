const router = require("express").Router();
const taskController = require("./task.controller");
const checkToken = require("../../middlewares/checkToken");

router.post("/", checkToken, taskController.create);
router.get("/", checkToken, taskController.getAll);
router.get("/:id", checkToken, taskController.getOne);
router.put("/:id", checkToken, taskController.update);
router.delete("/:id", checkToken, taskController.delete);

router.patch("/:id/complete", checkToken, taskController.markComplete);

router.get("/filter/status", checkToken, taskController.filter);

module.exports = router;

