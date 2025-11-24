const router = require("express").Router();
const controller = require("./user.controller");
const checkToken = require("../../middlewares/checkToken");

router.get("/", checkToken, controller.getUsers);
router.get("/:id", checkToken, controller.getUser);
router.put("/:id", checkToken, controller.updateUser);
router.delete("/:id", checkToken, controller.deleteUser);

module.exports = router;
