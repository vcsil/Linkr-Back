import { Router } from "express";
import { getTrending } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/trending', getTrending);

export default userRouter;