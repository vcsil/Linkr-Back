import { Router } from "express";
import { createPost, timeline } from "../controllers/postsControllers.js";
import validateSchema from "../middlewares/schemaValidator.js";
import postSchema from "../schemas/postSchema.js";
import validateHashtag from "../middlewares/validateHashtag.js";

const postsRouter = Router();

postsRouter.post("/post", validateSchema(postSchema), validateHashtag, createPost);
postsRouter.get("/timeline", timeline);

export default postsRouter;
