import { Router } from "express";
import * as controller from "./message.controller";
import jwtValidation from "../../middlewire/jwtvalidation";

const router: Router = Router();

router.get("/:chatId", jwtValidation, controller.getMessages);

export default router;
