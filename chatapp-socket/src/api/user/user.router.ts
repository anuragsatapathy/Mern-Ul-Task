import { Router } from "express";
import * as controller from "./user.controller";
import jwtValidation from "../../middlewire/jwtvalidation";

const router: Router = Router();

router.get("/", jwtValidation, controller.getUsers);
router.get("/search", jwtValidation, controller.searchUsers);

export default router;
