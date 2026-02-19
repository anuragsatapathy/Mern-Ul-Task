import { Router } from "express";

import authRoutes from "./auth/auth.router";
import userRoutes from "./user/user.router";
import messageRoutes from "./message/message.router";
import chatRoutes from "./chat/chat.router";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/message", messageRoutes);
router.use("/chat", chatRoutes);

export default router;
