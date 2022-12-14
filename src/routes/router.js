import { Router } from "express";
import authRouter from "./authRouter.js";
import postsRouter from "./postRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(postsRouter);

export default router;