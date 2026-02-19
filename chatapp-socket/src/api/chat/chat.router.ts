import { Router } from "express";
import * as controller from "./chat.controller";
import jwtValidation from "../../middlewire/jwtvalidation";

const router: Router = Router();

router.post("/", jwtValidation, controller.createChat);
router.get("/", jwtValidation, controller.getChats);

export default router;
