import { Router } from "express";
import { createPost, timeline } from "../controllers/postsControllers.js";
import validateSchema from "../middlewares/schemaValidator.js";
import postSchema from "../schemas/postSchema.js";
import validateHashtag from "../middlewares/validateHashtag.js";
import validateToken from "../middlewares/validateToken.js";

const postsRouter = Router();

postsRouter.post(
    "/post",
    validateToken,
    validateSchema(postSchema),
    validateHashtag,
    createPost
);
postsRouter.get("/timeline", timeline);

export default postsRouter;
