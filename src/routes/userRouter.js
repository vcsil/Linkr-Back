import { Router } from "express";
import { getTrending, getHashtagPosts, getUserPosts } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/trending', getTrending);
userRouter.get('/hashtag/:hashtag', getHashtagPosts);
userRouter.get('/user/:id', getUserPosts);

export default userRouter;