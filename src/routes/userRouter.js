import { Router } from "express";
import { getTrending, getHashtagPosts } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/trending', getTrending);
userRouter.get('/hashtag/:hashtag', getHashtagPosts);

export default userRouter;