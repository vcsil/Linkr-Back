import { Router } from "express";
import { createPost, deletePost, likePost, timelinePosts, updatePost } from "../controllers/postsControllers.js";
import validateSchema from "../middlewares/schemaValidator.js";
import postSchema from "../schemas/postSchema.js";
import validateHashtag from "../middlewares/validateHashtag.js";
import validateToken from "../middlewares/validateToken.js";

const postsRouter = Router();

postsRouter.use(validateToken);
postsRouter.post(
    "/post",
    validateSchema(postSchema),
    validateHashtag,
    createPost
);
postsRouter.get("/timeline", timelinePosts);
postsRouter.put("/post/:postId", validateHashtag, updatePost);
postsRouter.delete("/post/:postId", deletePost);
postsRouter.post("/like/:postId", likePost);

export default postsRouter;
